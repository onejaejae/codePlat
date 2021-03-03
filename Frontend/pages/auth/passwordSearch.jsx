import React, { useState, useCallback } from "react";
import Head from "next/head";
import AuthLayout from "../../components/layout/AuthLayout";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { withRouter } from "next/router";

/**
 * @author 박진호
 * @version 1.0
 * @summary 비밀번호 찾기 페이지
 */

const passwordSearch = ({ router }) => {
  // local state

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // event listener

  const onChangeNewPassword = useCallback((e) => {
    setNewPassword(e.target.value);
  }, []);
  const onChangeNewPasswordConfirm = useCallback((e) => {
    setNewPasswordConfirm(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    const email = router.query.email;
    axios
      .patch(`/api/changePassword`, { email, password: newPassword })
      .then((res) => {
        alert("비밀번호가 변경되었습니다.");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router, newPassword]);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>비밀번호 찾기</title>
      </Head>
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

export default withRouter(passwordSearch);
