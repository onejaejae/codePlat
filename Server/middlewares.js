import multer from "multer";
// import aws from "aws-sdk";
// import multerS3 from "multer-s3";

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_KEY,
//   secretAccessKey: process.env.AWS_PRIVATE_KEY,
//   region: "ap-northeast-2",
// });

export const multerAvatar = multer({
  dest: "uploads/avatars",
});

// 파일용 multer
export const multerFile = multer({ dest: "uploads/files" });
