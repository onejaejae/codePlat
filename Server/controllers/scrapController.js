import Post from "../models/Post";
import User from "../models/User";
import Scrap from "../models/Scrap";

export const postUpScrap = async (req, res) => {
  const {
    body: { type, id: postId },
  } = req;

  try {
    const post = await Post.findById(postId);

    // 1) scrap 생성
    const scrap = await Scrap.create({
      userId: req.user.id,
      postId,
      type,
    });
    await scrap.save();

    // 2) user 에 저장

    req.user.scraps.unshift(scrap.id);
    await req.user.save();

    // 3) post 에 저장
    post.scraps.unshift(scrap.id);
    await post.save();

    return res.status(201).json({
      success: true,
      scrap,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};

export const postUnScrap = async (req, res) => {
  try {
    // 1) scrap 객체 찾기
    const scrapId = req.params.id;
    const scrap = await Scrap.findById(scrapId);

    const { postId } = scrap;

    // 2) post의 scrap 에서 해당 scrap 지우기
    const post = await Post.findById(postId);
    const indexPost = await post.scraps.indexOf(scrapId);

    post.scraps.splice(indexPost, 1);
    await post.save();

    // 3) user 의 scrap 에서 해당 scrap 지우기
    const { userId } = scrap;
    const user = await User.findById(userId);

    const indexUser = await user.scraps.indexOf(scrapId);

    user.scraps.splice(indexUser, 1);
    await user.save();

    // 4) scrap DB 삭제
    await Scrap.findByIdAndDelete(scrapId);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error,
    });
  }
};
