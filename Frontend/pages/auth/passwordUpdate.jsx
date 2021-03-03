import React, { useCallback, useState } from "react";
import { Form, Input, Button } from "antd";
import Head from "next/head";
import AuthLayout from "../../components/layout/AuthLayout";
import Header from "../../components/common/Header";
import wrapper from "../../store/configureStore";
import { setUserRequestAction } from "../../reducers/user";
import { END } from "redux-saga";
import client from "../../lib/api/client";
import axios from "axios";
import Router, { withRouter } from "next/router";

/**
 * @author 박진호
 * @version 1.0
 * @summary 비밀번호 변경 페이지
 */

const passwordUpdate = () => {
  // local state

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newPasswordMatchError, setNewPasswordMatchError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  // event listener

  const onChangeCurrentPassword = useCallback((e) => {
    setCurrentPassword(e.target.value);
  }, []);
  const onChangeNewPassword = useCallback((e) => {
    setNewPassword(e.target.value);
  }, []);
  const onChangeNewPasswordConfirm = useCallback((e) => {
    setNewPasswordConfirm(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    if (
      currentPassword === "" ||
      newPassword === "" ||
      newPasswordConfirm === ""
    ) {
      alert("빈칸을 채워주세요.");
      return;
    }
    axios
      .patch(`/api/users/changePassword`, {
        password: currentPassword,
        newPassword: newPassword,
      })
      .then((res) => {
        if (res.data.message) {
          setCurrentPasswordError(true);
          alert("현재 비밀번호가 일치하지 않습니다.");
          return;
        } else if (res.data.success) {
          alert("비밀번호 변경 성공!");
          Router.push("/");
        } else {
          alert("비밀번호 변경 성공!");
          Router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPassword, newPassword, newPasswordConfirm]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>비밀번호 변경</title>
      </Head>
      <Header />
      <AuthLayout>
        <div
          style={{
            background: "#fff",
            borderRadius: "5px",
            padding: "40px",
            margin: "140px 0",
          }}
        >
          <h2>비밀번호 변경</h2>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: "red" }}>*</span> 안전한 비밀번호로 계정을
            보호하세요.
          </div>

          <Form>
            <Form.Item
              name="current-password"
              rules={[
                {
                  required: true,
                  message: "현재 비밀번호를 입력해주세요.",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="현재 비밀번호"
                onChange={onChangeCurrentPassword}
              />
            </Form.Item>
            <Form.Item
              name="new-password"
              rules={[
                {
                  required: true,
                  message: "새 비밀번호를 입력해주세요.",
                },
                {
                  min: 8,
                  message: "8자리 이상 비밀번호를 입력해주세요.",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="새 비밀번호"
                onChange={onChangeNewPassword}
              />
            </Form.Item>
            <Form.Item
              name="new-password-confirm"
              dependencies={["new-password"]}
              rules={[
                {
                  required: true,
                  message: "새 비밀번호 확인을 입력해주세요.",
                },
                {
                  min: 8,
                  message: "8자리 이상 비밀번호를 입력해주세요.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new-password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("새 비밀번호가 일치하지 않습니다.");
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="새 비밀번호 확인"
                onChange={onChangeNewPasswordConfirm}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: "center" }}>
                <Button onClick={onSubmit}>확인</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </AuthLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    //console.log(context);

    const cookie = context.req ? context.req.headers.cookie : "";
    client.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      //console.log("fuckcookie", cookie);
      client.defaults.withCredentials = true;
      client.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch(setUserRequestAction());
    //context.store.dispatch(mainLoadPostsReqeustAction());
    //context.store.dispatch(END);
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default withRouter(passwordUpdate);
