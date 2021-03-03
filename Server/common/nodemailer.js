import nodemailer from "nodemailer";
import smtpTransporter from "nodemailer-smtp-transport";
import inlineCss from "nodemailer-juice";
import { emailForm } from "./emailForm";
import { BACK_URL, CLIENT_URL } from "./config";

// eslint-disable-next-line import/prefer-default-export
export const nodemail = (email, keyForVerify, type = "confirm") => {
  // local 로그인일 경우 nodemailer로 메일 인증 구현
  console.log("type", type);

  const smtpTransport = nodemailer.createTransport(
    smtpTransporter({
      service: "Gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );

  smtpTransport.use("compile", inlineCss());

  //url

  let url;
  let emailType = "confirm";

  if (type === "confirm") {
    const encodingKey = encodeURIComponent(keyForVerify);
    url = `${BACK_URL}/api/confirmEmail?key=${encodingKey}`;
  } else {
    // 프론트에서 만든 password 바꾸는 uri 주기
    // 쿼리에 이메일 붙여서 주고 프론트에서 보낼때 이메일 백으로 주기
    // ex
    emailType = "password";
    url = `${CLIENT_URL}/auth/passwordSearch?email=${email}`;
  }

  const mailOpt = {
    from: "프로젝트",
    to: email,
    subject:
      type === "confirm" ? "이메일 인증을 진행해주세요." : "비밀번호 변경 링크",
    html: emailForm(url, emailType),
  };
  //전송
  smtpTransport.sendMail(mailOpt, (err) => {
    if (err) {
      console.log("err", err);
    } else {
      console.log("email has been sent.");
    }
    smtpTransport.close();
  });
};
