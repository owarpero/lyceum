import React, { useState } from "react";
import "antd/dist/antd.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { Link } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import { setCookie } from "../index";

const { Title } = Typography;
export default (props) => {
  const [form] = Form.useForm();

  let [confirmLoginLoading, setConfirmLoginLoading] = useState(false);
  async function onFinish(data) {
    console.log(data);
    setConfirmLoginLoading(true);
    const rawResponse = await fetch("https://app.kangreon.ru/liceum/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: data.login.trim(),
        password: data.password.trim(),
      }),
    });
    const content = await rawResponse.json();
    message.error(content.message);
    if (content.code === "200") {
      console.log(content);

      setConfirmLoginLoading(false);

      setCookie("user", content.name.trim());
      setCookie("score", content.score.trim());

      props.setCookiesReload(false);

      form.resetFields();

      props.setLoginModalVisible(false);
    } else if (content.code === "404") {
      setConfirmLoginLoading(false);

      message.error(content.message);

      form.resetFields();
    } else if (content.code === "1") {
      setConfirmLoginLoading(false);

      message.error(content.message);

      form.resetFields();
    }
  }

  let handleLoginCancel = () => {
    console.log("Clicked cancel button");
    props.setLoginModalVisible(false);
  };

  return (
    <div className="flex flex-align">
      <Modal
        visible={props.LoginModalVisible}
        confirmLoading={confirmLoginLoading}
        onCancel={handleLoginCancel}
        footer={null}
      >
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Title level={3}>Войти в аккаунт</Title>
          <Form.Item
            name="login"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите имя пользователя!",
              },
              {
                min: 6,
                max: 14,
                message: "Не верная длинна имени пользователя!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Имя пользователя"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                max: 20,
                message: "Не верная длинна пароля!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            {/* <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox></Checkbox>
            </Form.Item> */}

            <Link className="login-form-forgot" to="/forgot_password">
              Забыли пароль?
            </Link>
          </Form.Item>

          <Form.Item>
            {confirmLoginLoading ? (
              <Button type="primary" loading>
                Загрузка
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Войти
              </Button>
            )}

            <Button type="link" onClick={props.RegistrationModalVisible}>
              Или зарегистроваться сейчас!
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
