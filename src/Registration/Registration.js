import { Button, Checkbox, Form, Input, Typography, message } from "antd";

import React, { useState } from "react";

import { Link } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import { setCookie } from "../index";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { Title } = Typography;
export default (props) => {
  let [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  async function onFinish(data) {
    setConfirmLoading(true);
    const rawResponse = await fetch("https://app.kangreon.ru/liceum/signup/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: data.nickname.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      }),
    });
    const content = await rawResponse.json();
    message.error(content.message);
    if (content.code === "304") {
      console.log(content);

      setCookie("user", content.username.trim());
      setCookie("score", content.score.trim());

      setConfirmLoading(false);

      props.setCookiesReload(false);
      props.setRegistrationModalVisible(false);

      form.resetFields();
    } else if (content.code === "0") {
      message.error(content.message);

      setConfirmLoading(false);

      form.resetFields();
    }
  }
  let handleCancel = () => {
    props.visible(false);
  };
  return (
    <div className="flex flex-align">
      <Modal
        // title="Registration"
        visible={props.RegistrationModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="registration-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login-form"
          {...layout}
        >
          <Title level={3}>Зарегистрироваться</Title>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                type: "email",
                message: "Введите правельный E-mail",
              },
              {
                required: true,
                message: "Введите E-mail",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Имя пользователья"
            name="nickname"
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
              {
                min: 6,
                max: 14,
                message: "Не верная длинна имени пользователя!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите пароль!",
              },
              {
                min: 6,
                max: 14,
                message: "Не верная длинна имени пользователя!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Пожалуйста подтвердите пароль!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("Пароли не совпадают !");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div>
            <Checkbox>
              I have read the <Link to={"/agreement"}>agreement</Link>
            </Checkbox>
          </div>

          <Form.Item>
            {confirmLoading ? (
              <Button type="primary" loading>
                Загрузка
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Подтвердить
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
