import { ErrorHandler, Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { signinInput } from "../../../common-types/index";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
// import { oauth2client } from "../utils/googleConfig";
import axios from "axios";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    FRONTEND_URL: string;
  };
  Variables: {
    userId: string;
    email: string;
    prisma: PrismaClient & ReturnType<typeof withAccelerate>;
    oauth2client: any; // Add the correct type for oauth2client if known
  };
}>();

router.get("/googleLogin", async (c) => {
  const prisma = c.get("prisma");
  console.log("called");
  const oauth2client = c.get("oauth2client");
  try {
    const { code } = c.req.query();

    if (!code) {
      c.status(400);
      return c.text("Code is required");
    }

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name } = userRes.data;

    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
    }

    const { id, name: userName, email: userEmail } = user;

    const jwtPayload = (expIn: number) => {
      return {
        userId: id,
        name: userName,
        email: userEmail,
        exp: expIn,
      };
    };
    console.log("sds");
    const expireIn3h = Math.floor(Date.now() / 1000) + 60 * 180;
    const expireIn1d = Math.floor(Date.now() / 1000) + 60 * 1440;

    const accessToken = await sign(
      jwtPayload(expireIn3h),
      c.env.JWT_ACCESS_TOKEN_SECRET
    );

    const refreshToken = await sign(
      jwtPayload(expireIn1d),
      c.env.JWT_REFRESH_TOKEN_SECRET
    );

    return c.json(
      {
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (error: any) {
    c.status(500);
    return c.text(`Error: ${error.message || "something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// signin
router.post("/", async (c) => {
  const prisma = c.get("prisma");

  try {
    const body = await c.req.json();
    const input = signinInput.safeParse(body);

    if (input.error) {
      return c.json({ message: input.error.errors }, 403);
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        email: input.data.email,
      },
    });

    if (!foundUser) {
      return c.json(
        { message: "User does not exist, Please create account" },
        403
      );
    }

    if (!foundUser.password) {
      return c.json({ message: "Password does not match" }, 403);
    }

    const isPwMatch = await bcrypt.compare(
      input.data.password,
      foundUser.password
    );

    if (!isPwMatch) {
      return c.json({ message: "Password does not match" }, 403);
    }

    const cookieToken = getCookie(c, "jwt");

    let prevTokens = !!cookieToken
      ? foundUser.refreshToken.filter((token) => token !== cookieToken)
      : foundUser.refreshToken;

    if (cookieToken) {
      const foundUser = await prisma.user.findFirst({
        where: {
          refreshToken: {
            has: cookieToken,
          },
        },
      });

      if (!foundUser) {
        prevTokens = [];
      }

      deleteCookie(c, "jwt", {
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
    }

    const jwtPayload = (expIn: number) => {
      return {
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        exp: expIn,
      };
    };

    const expireIn3h = Math.floor(Date.now() / 1000) + 60 * 180;
    const expireIn1d = Math.floor(Date.now() / 1000) + 60 * 1440;

    const accessToken = await sign(
      jwtPayload(expireIn3h),
      c.env.JWT_ACCESS_TOKEN_SECRET
    );

    const refreshToken = await sign(
      jwtPayload(expireIn1d),
      c.env.JWT_REFRESH_TOKEN_SECRET
    );

    const newRefreshTokenArray = [...prevTokens, refreshToken];

    const updatedRefreshToken = await prisma.user.update({
      where: {
        email: foundUser.email,
      },
      data: {
        refreshToken: newRefreshTokenArray,
      },
    });

    if (!updatedRefreshToken) {
      return c.json({ message: "Error updating refresh token" }, 403);
    }

    const totalPostsCount = await prisma.post.count();

    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    setCookie(c, "jwt", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      expires: oneDayFromNow,
      partitioned: true,
    });

    return c.json(
      {
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        bio: foundUser.bio,
        token: accessToken,
        totalPostsCount: totalPostsCount || 0,
        about: foundUser.about,
      },
      201
    );
  } catch (error) {
    c.status(500);
    return c.text(`${error || "something went wrong"}`);
  } finally {
    await prisma.$disconnect();
  }
});

// refresh token

router.get("/", async (c) => {
  const prisma = c.get("prisma");

  try {
    const cookieToken = getCookie(c, "jwt");

    if (!cookieToken) {
      return c.json({ message: "Token required" }, 403);
    }

    const verifiedToken = await verify(
      cookieToken,
      c.env.JWT_REFRESH_TOKEN_SECRET
    );

    // Find user by refresh token
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshToken: {
          has: cookieToken,
        },
      },
    });

    // If user not found or token not verified, handle accordingly
    if (!foundUser) {
      if (!verifiedToken) {
        return c.json({ message: "Unauthenticated" }, 403);
      }

      // Possible token theft, clear refresh tokens
      await prisma.user.update({
        where: {
          email: verifiedToken.email as string,
        },
        data: {
          refreshToken: [],
        },
      });

      return c.json({ message: "No user found with this token" }, 403);
    }

    // Remove the old token from the list
    const removedPrevTokenArray = foundUser?.refreshToken.filter(
      (token) => token !== cookieToken
    );

    // If token is not verified or user email does not match
    if (!verifiedToken || foundUser.email !== verifiedToken.email) {
      await prisma.user.update({
        where: {
          email: foundUser.email,
        },
        data: {
          refreshToken: removedPrevTokenArray,
        },
      });

      return c.json({ message: "Token Expired" }, 403);
    }

    // Prepare JWT payloads
    const createJWTPayload = (expIn: number) => ({
      userId: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      exp: expIn,
    });

    const expireIn3h = Math.floor(Date.now() / 1000) + 60 * 180; // 3 hours
    const expireIn1d = Math.floor(Date.now() / 1000) + 60 * 1440; // 1 day

    // Generate new tokens
    const refreshToken = await sign(
      createJWTPayload(expireIn1d),
      c.env.JWT_REFRESH_TOKEN_SECRET
    );
    const accessToken = await sign(
      createJWTPayload(expireIn3h),
      c.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Update user's refresh tokens
    const newRefreshTokenArray = [...removedPrevTokenArray, refreshToken];
    await prisma.user.update({
      where: {
        email: foundUser.email,
      },
      data: {
        refreshToken: newRefreshTokenArray,
      },
    });

    // Set new refresh token in cookie
    deleteCookie(c, "jwt", { httpOnly: true, secure: true, sameSite: "None" });

    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    setCookie(c, "jwt", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      expires: oneDayFromNow,
      partitioned: true,
    });
    const totalPostsCount = await prisma.post.count();
    // Respond with new access token and user details
    return c.json(
      {
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        bio: foundUser.bio,
        token: accessToken,
        totalPostsCount: totalPostsCount || 0,
        about: foundUser.about,
      },
      201
    );
  } catch (error) {
    c.status(500);
    return c.text(`${error}`);
  } finally {
    await prisma.$disconnect();
  }
});

//logout
router.post("/logout", async (c) => {
  const prisma = c.get("prisma");

  const cookieToken = getCookie(c, "jwt");

  const foundUser = await prisma.user.findFirst({
    where: {
      refreshToken: {
        has: cookieToken,
      },
    },
  });

  if (foundUser) {
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (token) => token !== cookieToken
    );
    await prisma.user.update({
      where: {
        email: foundUser.email,
      },
      data: {
        refreshToken: newRefreshTokenArray,
      },
    });
  }

  deleteCookie(c, "jwt", {
    secure: true,
    httpOnly: true,
    sameSite: "None",
    partitioned: true,
  });

  return c.json({ message: "logged out" }, 200);
});

export default router;
