import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

export const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "codePlat/avatar",
  }),
});

// 파일용 multer
export const multerFile = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "codePlat/file",
  }),
});
