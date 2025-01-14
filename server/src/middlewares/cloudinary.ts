// import { createMiddleware } from "hono/factory";
// import { v2 as cloudinary } from "cloudinary";

// export const uploadImages = createMiddleware(async (c, next) => {
//   cloudinary.config({
//     cloud_name: c.env.CLOUDINARY_CLOUD_NAME,
//     api_key: c.env.CLOUDINARY_API_KEY,
//     api_secret: c.env.CLOUDINARY_API_SECRET,
//   });

//   async function handleImages(data: any) {
//     const uploadResult = await cloudinary.uploader
//       .upload(data)
//       .catch((error) => {
//         console.log(error);
//       });

//     if (uploadResult) {
//       const optimizeUrl = cloudinary.url(uploadResult.public_id, {
//         fetch_format: "auto",
//         quality: "auto",
//       });

//       return {
//         public_id: uploadResult.public_id,
//         url: optimizeUrl,
//       };
//     }
//     return null;
//   }

//   c.set("handleImages", handleImages);

//   await next();
// });
