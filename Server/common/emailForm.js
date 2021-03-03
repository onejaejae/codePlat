// eslint-disable-next-line import/prefer-default-export
export const emailForm = (url, type) => {
  return `
  <style>div {  text-align:center } </style>
  <style>img { width: 360px; alt:codePlat; loading:laze; text-align : center; line-height : 24px } </style><div><img src=https://onetube.s3.ap-northeast-2.amazonaws.com/avatar/0ab8883f21a110fae750a8944911091a /><div>
  <style>span {  color: #2e4257; font-size: 22px;  font-weight: 700; line-height: 42px; text-decoration: none solid rgb(51,153,0); text-align:left; font-family: ShopifySans, "Helvetica Neue", Helvetica, sans-serif; padding: 10px 0px; } </style><span>${
    type === "confirm" ? "가입해주셔서 감사합니다." : "비밀번호 변경 요청 "
  }</span>
  <div></div>
  <style>h3 {  font-weight: 400; font-size: 16px; line-height: 24px; color: #2e4257; font-family: ShopifySans, "Helvetica Neue", Helvetica, sans-serif; } </style><h3>${
    type === "confirm" ? "환영합니다" : "안녕하세요"
  }</h3>
    <h3>${
      type === "confirm"
        ? "아래의 링크를 클릭해 주시면 가입이 완료됩니다!"
        : `비밀번호를 변경하려면 아래 링크를 방문해 주세요.`
    }
</h3>
<div></div>
<style>a { background-color: #7ab55c; border-radius: 4px; color: rgb(255, 255, 255); display: inline-block; font-family: sans-serif; font-size: 15px; text-align: center; text-decoration: none; text-size-adjust: none; color: white; border:0; border-radius:5px padding: 10px; }</style><a href=${url}>${
    type === "confirm" ? "메일 인증하기" : "비밀번호 변경하기"
  }
</a>
  `;
};

//`<div>
//       <div
//         style={{
//           fontSize: "30px",
//           textAlign: "left",
//           margin: "10px",
//           color: "#16172b",
//           fontWeight: "bold"
//         }}
//       >
//         LOGO
//       </div>
//       <div style={{ border: "0.5px solid gray" }}></div>
// <div
//   style={{
//     color: "#143263",
//     fontSize: "15px",
//     fontWeight: "bold",
//     margin: "10px",
//   }}
// >
//   ${type === "confirm" ? "가입해주셔서 감사합니다." : "비밀번호 변경 요청 "}
// </div>;
// <div
//   style={{
//     color: "#3e4045",
//     fontSize: "10px",
//     margin: "15px 10px"
//   }}
// >
// ${
//   type === "confirm"
//     ? "환영합니다. 아래의 링크를 클릭해 주시면 가입이 완료됩니다!"
//     : `안녕하세요.

//       비밀번호를 변경하려면 아래 링크를 방문해 주세요.`
// }

// </div>
//       <div style={{ margin: "10px", textAlign: "left" }}>
//         <a href=${url}>
// <button
//   style={{
//     background: "#143263",
//     color: "white",
//     border: "0",
//     borderRadius: "5px",
//     padding: "10px",
//   }}
// >
//   ${type === "confirm" ? "메일 인증하기" : "비밀번호 변경하기"}
// </button>;
//         </a>
//       </div>
//     </div>`;
