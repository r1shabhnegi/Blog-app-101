// import { createMiddleware } from "hono/factory";
// import formidable from "formidable";

// export const parseForm = createMiddleware(async (c, next) => {
//   const form = new formidable.IncomingForm();

//   form.parse(c.req as any, (err, fields, files) => {
//     if (err) {
//       c.status(400);
//       c.text("Error parsing the form: " + err.message);
//     //   return;
//     }
//     c.set("fields", fields);
//     c.set("files", files);
//     next();
//   });
// });
