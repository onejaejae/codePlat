import React, { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Divider, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../../reducers/user";
import Router from "next/router";
import SocialTemplate from "../common/auth/SocialTemplate";
import axios from "axios";

/**
 * @author 박진호
 * @version 1.0
 * @summary 로그인 종합 컴포넌트
 */

const LoginInputForm = () => {
  // redux

  const dispatch = useDispatch();
  const { loginLoading, me, loginError } = useSelector((state) => state.user);

  // local state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  // event listener

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
    setEmailError(false);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  }, []);

  const onLogin = useCallback(() => {
    if (email == "" || password == "") {
      return;
    }

    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  const showModal = useCallback((e) => {
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback((e) => {
    setIsModalVisible(false);
  }, []);

  const onChangeSearchEmail = useCallback((e) => {
    setSearchEmail(e.target.value);
  }, []);

  const onSearchPasswordSubmit = useCallback(async () => {
    await axios
      .post(`/api/forgotPassword`, { email: searchEmail })
      .then((res) => {
        if (res.data.message === "유저 정보가 없습니다") {
          alert("가입된 이메일이 아닙니다!");
          return;
        } else {
          alert("가입하신 이메일로 링크를 보내드렸습니다.");
          setIsModalVisible(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchEmail]);

  useEffect(() => {
    if (loginError == "Incorrect email") {
      setEmailError(true);
      return;
    } else if (loginError == "Incorrect password.") {
      setPasswordError(true);
      return;
    }
    if (me) {
      Router.push("/");
    }
  }, [me, loginError]);

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
      >
        {emailError ? (
          <Form.Item
            name="email"
            validateStatus="error"
            help="존재하지 않는 이메일입니다."
            rules={[
              {
                required: true,
                message: "이메일을 입력해주세요.",
              },
            ]}
            onChange={onChangeEmail}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "이메일을 입력해주세요.",
              },
            ]}
            onChange={onChangeEmail}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
        )}
        {passwordError ? (
          <Form.Item
            name="password"
            validateStatus="error"
            help="비밀번호가 다릅니다."
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해주세요.",
              },
            ]}
            onChange={onChangePassword}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해주세요.",
              },
            ]}
            onChange={onChangePassword}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
        )}

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{
              width: "100%",
              background: "#313355",
              color: "#fff",
              border: "1px solid #313355",
            }}
            onClick={onLogin}
            loading={loginLoading}
          >
            로그인
          </Button>
        </Form.Item>
        <Divider style={{ fontSize: "12px", color: "#888" }}>
          소셜 로그인
        </Divider>
        <SocialTemplate />

        <Form.Item
          style={{
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "0",
          }}
        >
          <span style={{ color: "tomato", marginRight: "5px" }}>*</span>
          계정이 없으신가요?
          <Link href="/auth/register">
            <a
              style={{
                textDecoration: "underline",
                marginLeft: "10px",
                fontSize: "12px",
                color: "#999",
              }}
            >
              회원가입
            </a>
          </Link>
        </Form.Item>
        <Form.Item
          style={{
            textAlign: "center",
          }}
        >
          <span style={{ color: "tomato", marginRight: "5px" }}>*</span>
          비밀번호를 잊으셨나요?
          <a
            style={{
              textDecoration: "underline",
              marginLeft: "10px",
              fontSize: "12px",
              color: "#999",
            }}
            onClick={showModal}
          >
            비밀번호 찾기
          </a>
          <Modal
            title="비밀번호 찾기"
            visible={isModalVisible}
            onOk={closeModal}
            onCancel={closeModal}
          >
            <p>
              비밀번호를 잊으셨나요? 가입한 이메일을 통해 비밀번호 수정 링크가
              전송됩니다.
            </p>
            <Form>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "이메일 형식으로 입력해주세요.",
                  },
                  {
                    required: true,
                    message: "이메일을 입력해주세요.",
                  },
                ]}
              >
                <Input
                  placeholder="가입된 이메일을 입력해주세요."
                  onChange={onChangeSearchEmail}
                />
              </Form.Item>
              <Form.Item>
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <Button onClick={onSearchPasswordSubmit}>
                    비밀번호 찾기
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Link href="/">
            <a style={{ color: "#888" }}>홈으로가기</a>
          </Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginInputForm;
