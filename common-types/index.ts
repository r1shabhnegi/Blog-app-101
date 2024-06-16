import { string, z } from "zod";
// signup
export const signupInput = z.object({
  name: z
    .string()
    .min(4, { message: "Must be 4 or more characters long" })
    .max(20, { message: "Must be 20 or fewer characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Must be 4 or more characters long" })
    .max(20, { message: "Must be 20 or fewer characters long" }),
});

export type signupType = z.infer<typeof signupInput>;

// signin
export const signinInput = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export type SigninType = z.infer<typeof signinInput>;

// Edit user information
const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  // "image/webp",
];

// const isAvatarRemovedEnum = ["true", "false"];

export const EditUserInfoInput = z
  .object({
    avatar: z.any(),
    name: z
      .string()
      .min(4, { message: "Must be 4 or more characters long" })
      .max(20, { message: "Must be 20 or fewer characters long" }),

    bio: z
      .string()
      .max(160, { message: "Must be 160 or fewer characters long" }),
    isAvatarRemoved: z.string(),
    // enum(["true", "false"]),
  })
  .required({ name: true, isAvatarRemoved: true });

export type EditUserInfoType = z.infer<typeof EditUserInfoInput>;

export const PublishPostInput = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.string(),
  image: z.any(),
});

export type PublishPostType = z.infer<typeof PublishPostInput>;
