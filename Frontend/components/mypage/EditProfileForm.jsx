import React, { useCallback } from "react";
import { Card, Form, Input, Button, Upload, Checkbox } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import shortid from "shortid";
import { SERVER_URL } from "../../lib/constant/constant";
import { UploadOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import firebase from "../../firebase";

/**
 * @author 박진호
 * @version 1.0
 * @summary 프로필 수정 폼 컴포넌트
 */

// style

const EditProfileFormWrapper = styled(Form)`
  .image-edit-btn {
    &:hover {
      color: #111;
      border: 1px solid #313355;
    }
  }
  .password-edit-btn {
    &:hover {
      color: #111;
      border: 1px solid #313355;
    }
  }
  @media (max-width: 900px) {
    width: 100%;
    .profile-card {
      margin: 0 auto;
    }
  }
`;

const RegisterInputItemWrapper = styled(Form.Item)`
  .ant-form-item-label {
    text-align: left;
  }
  .email-code {
    width: 200px;
  }
  .ant-form-item-control {
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileItemWrapper = styled.div`
  margin: 20px 0;
`;

const EditProfileForm = ({
  onChangeProfileImage,
  onDeleteProfileImage,
  onChangeNickname,
  onChangeGithubId,
  onToggleGitSecret,
  gitSecret,
}) => {
  // redux

  const { me } = useSelector((state) => state.user);

  // event listener

  const onDeleteAccount = useCallback(() => {
    let deleteConfirm = confirm("정말 회원 탈퇴를 진행하시겠습니까?");
    if (deleteConfirm) {
      axios
        .delete(`/api/users/${me._id}`)
        .then(async (res) => {
          alert(
            "회원 탈퇴 처리가 정상적으로 처리되었습니다. CodePlat을 이용해주셔서 감사합니다.",
          );
          let user = firebase.auth().currentUser;
          if (user) {
            await user
              .delete()
              .then(async () => {
                await firebase.database().ref("users").child(user.uid).remove();
                console.log("firebase 탈퇴 성공");
              })
              .catch((err) => {
                console.log(err);
              });
          }
          Router.push(`/`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }, [me]);

  if (!me) return null;
  return (
    <EditProfileFormWrapper>
      <div className="site-card-border-less-wrapper">
        <Card
          title="프로필 수정"
          bordered={true}
          style={{ width: 300 }}
          className="profile-card"
        >
          <ProfileItemWrapper>
            <span>닉네임</span>
            <Input
              disabled
              placeholder="닉네임"
              onChange={onChangeNickname}
              defaultValue={me && me.nickname}
            />
          </ProfileItemWrapper>

          <ProfileItemWrapper>
            <span>깃허브</span>
            <Input
              placeholder="깃허브"
              onChange={onChangeGithubId}
              defaultValue={me && me.githubUrl}
            />
            <Checkbox
              onChange={onToggleGitSecret}
              defaultChecked={me && me.secretGithub}
            >
              비공개
            </Checkbox>
          </ProfileItemWrapper>

          <ProfileItemWrapper>
            <div>프로필 사진 변경</div>
            <Upload
              name="logo"
              listType="picture"
              accept="image/*"
              beforeUpload={onChangeProfileImage}
              maxCount={1}
              defaultFileList={
                me.avatarUrl && [
                  {
                    uid: shortid.generate(),
                    url: `${me.avatarUrl}`,
                    thumbUrl: `${me.avatarUrl}`,
                    name: me.avatarUrl,
                    status: "done",
                  },
                ]
              }
              onRemove={onDeleteProfileImage}
            >
              <Button className="image-edit-btn" icon={<UploadOutlined />}>
                이미지 변경
              </Button>
            </Upload>
          </ProfileItemWrapper>
          <Link href="/auth/passwordUpdate">
            <a>
              <Button className="password-edit-btn" block>
                비밀번호 변경
              </Button>
            </a>
          </Link>
          <Button
            type="danger"
            block
            style={{ marginTop: "10px" }}
            onClick={onDeleteAccount}
          >
            회원 탈퇴
          </Button>
        </Card>
      </div>
    </EditProfileFormWrapper>
  );
};

export default EditProfileForm;
