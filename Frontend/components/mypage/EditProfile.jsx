import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import EditProfileForm from "./EditProfileForm";
import SkillFilterForm from "../common/contents/SkillFilterForm";
import { Button, Card } from "antd";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../lib/constant/constant";
import shortid from "shortid";
import { message } from "antd";
import axios from "axios";
import FormData from "form-data";

/**
 * @author 박진호
 * @version 1.1
 * @summary 프로필 수정 폼 + 기술 스택 수정 폼 컨테이너 컴포넌트
 */

const ProfileReviseFormWrapper = styled.div`
  display: flex;
  padding: 2rem 0;
  .edit-profile-form {
    flex: 1;
    padding: 20px;
  }
  .skill-filter-form {
    flex: 2;
    padding: 20px;
  }
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const EditProfile = () => {
  // redux

  const { me } = useSelector((state) => state.user);
  const { skill } = useSelector((state) => state.skill);

  // local state

  const [nickname, setNickname] = useState(me && me.nickname);
  const [githubId, setGithubId] = useState("");
  const [gitSecret, setGitSecret] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // event listener

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);
  const onChangeGithubId = useCallback((e) => {
    setGithubId(e.target.value);
  }, []);
  const onToggleGitSecret = useCallback(() => {
    setGitSecret(!gitSecret);
  }, [gitSecret]);

  const onChangeProfileImage = useCallback((e) => {
    setProfileImage(e);
  }, []);

  const onDeleteProfileImage = useCallback((e) => {
    setProfileImage(null);
  }, []);

  const onSubmit = useCallback(() => {
    setLoading(true);
    const config = {
      headers: {
        Accept: "application/json",
        enctype: "multipart/form-data",
      },
    };
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("githubUrl", githubId);
    formData.append("techStack", JSON.stringify(skill));
    formData.append("secretGithub", gitSecret);
    formData.append("avatar", profileImage);

    axios
      .patch(`/api/users`, formData, config)
      .then((res) => {
        submitDoneMessage();
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  }, [skill, nickname, githubId, gitSecret, profileImage]);

  // helper method

  const submitDoneMessage = () => {
    message.success({
      content: "저장 완료!",
      className: "custom-class",
      style: {
        marginTop: "5vh",
      },
    });
  };

  // hooks

  useEffect(() => {
    setProfileImage({
      uid: shortid.generate(),
      url: `${me.avatarUrl}`,
      thumbUrl: `${me.avatarUrl}`,
      status: "done",
    });
    setNickname(me.nickname);
    setGithubId(me.githubId);
  }, [me]);

  useEffect(() => {
    if (me) {
      setGitSecret(me.secretGithub);
      setGithubId(me.githubUrl);
    }
  }, [me]);

  if (!me) return null;

  return (
    <>
      <ProfileReviseFormWrapper>
        <div className="edit-profile-form">
          <EditProfileForm
            onChangeProfileImage={onChangeProfileImage}
            onDeleteProfileImage={onDeleteProfileImage}
            onChangeNickname={onChangeNickname}
            onChangeGithubId={onChangeGithubId}
            onToggleGitSecret={onToggleGitSecret}
            gitSecret={gitSecret}
          />
        </div>
        <div className="skill-filter-form">
          <Card title="관심 기술 수정" bordered={true}>
            {" "}
            <SkillFilterForm
              type="mypage"
              values={me.techStack}
              isEdit={true}
            />
          </Card>
        </div>
      </ProfileReviseFormWrapper>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Button
          type="primary"
          onClick={onSubmit}
          loading={loading}
          style={{
            background: "#313355",
            color: "#fff",
            border: "1px solid #313355",
          }}
        >
          저장하기
        </Button>
      </div>
    </>
  );
};

export default EditProfile;
