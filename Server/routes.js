// HOME

// Github
const HOME = "/api";
const GITHUB = "/github";
const GITHUB_CALLBACK = "/github/callback";

// Naver
const NAVER = "/naver";
const NAVER_CALLBACK = "/naver/callback";

// Kakao
const KAKAO = "/kakao";
const KAKAO_CALLBACK = "/kakao/callback";

// Google
const GOOGLE = "/google";
const GOOGLE_CALLBACK = "/google/callback";

// 로그인, 로그아웃, 회원가입
const LOGIN = "/login";
const JOIN = "/join";
const JOIN_OPTION = "/join/optionForm";
const JOIN_CONFIRM_EMAIL = "/confirmEmail";
const LOGOUT = "/logout";
const SET_USER = "/setUser";

// 비밀번호 찾기
const FORGOT_PASSWORD = "/forgotPassword";

// 메일 인증
const MAIL_AUTH = "/mailAuth";

// user
const USERS = "/api/users";
const USER_ACTIVITY = "/:id";
const USER_DETAIL = "/getUserDetail";
const USER_SECESSION = "/:id";
const CHANGE_PASSWORD = "/changePassword";

// post
const POSTS = "/api/posts";
const POST = "/getPosts";
const POST_ID = "/:id";
const GET_FORUM = "/getForum";

// comment
const COMMENTS = "/api/comments";
const COMMENT_DELETE = "/:id";
const COMMENT_PARENT_DELETE = "/parentDelete";

// scrap
const SCRAP = "/api/scraps";
const UN_SCRAP = "/:id";

// like
const LIKE = "/api/likes";
const UN_LIKE = "/:id";

const routes = {
  user: USERS,
  home: HOME,
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  naver: NAVER,
  naverCallback: NAVER_CALLBACK,
  kakao: KAKAO,
  kakaoCallback: KAKAO_CALLBACK,
  google: GOOGLE,
  googleCallback: GOOGLE_CALLBACK,
  login: LOGIN,
  join: JOIN,
  joinOption: JOIN_OPTION,
  confirmEmail: JOIN_CONFIRM_EMAIL,
  setUser: SET_USER,
  logout: LOGOUT,
  userDetail: USER_DETAIL,
  userActivity: USER_ACTIVITY,
  changePassword: CHANGE_PASSWORD,
  posts: POSTS,
  post: POST,
  postId: POST_ID,
  getForum: GET_FORUM,
  comments: COMMENTS,
  commentDelete: COMMENT_DELETE,
  commentParentDelete: COMMENT_PARENT_DELETE,
  scrap: SCRAP,
  unScrap: UN_SCRAP,
  like: LIKE,
  unLike: UN_LIKE,
  forgotPassword: FORGOT_PASSWORD,
  secession: USER_SECESSION,
  mailAuth: MAIL_AUTH,
};

export default routes;
