import React, { useState, useEffect } from "react";

import "./App.css";
import { Button, message, Typography } from "antd";
//import Arcanoid from "./arcanoid";
import {
  BrowserRouter as Router,

  useHistory,
} from "react-router-dom";
import Login from "./Login/Login";
import Registration from "./Registration/Registration";
import logo from "./img/logo.png";

import Top from "./topPlayers/topPlayers";
import goldkorona from "./img/goldkorona.svg";
import { getCookie, deleteCookie, setCookie } from "./index";

const { Text } = Typography;

function App() {
  let [RegistrationModalVisible, setRegistrationModalVisible] = useState(false);

  let [LoginModalVisible, setLoginModalVisible] = useState(false);

  let [cookiesReload, setCookiesReload] = useState(false);

  let history = useHistory();

  useEffect(() => {
    getCookie("user") === undefined
      ? setCookiesReload(false)
      : setCookiesReload(true);
  });
  const showRegistrationModal = () => {
    setRegistrationModalVisible(true);
  };

  const showLoginModal = () => {
    setLoginModalVisible(true);
  };
  const leave = () => {
    deleteCookie("user");
    deleteCookie("score");
    setCookiesReload(false);
  };

  const isLogined = () => {
    if (getCookie("user") === undefined) {
      message.error("Для прохождения теста надо войти в свою учетную запись ");
    } else {
      sessionStorage.setItem("selectedTest", 2);
      setCookie("score", 0);
      history.push({
        pathname: "/test",
      });
    }
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg  navbar-light bg-light">
        <div className="navbar-brand" href="#">
          <img src={logo}></img>
          <span className="LyceumNavbarText">Мая краіна</span>
        </div>

        <div className=" navbar-collapse" id="navbarNav">
          {!cookiesReload ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Button
                  className="nav-link"
                  type="link"
                  onClick={showLoginModal}
                >
                  Вход
                </Button>
              </li>
              <li className="nav-item">
                <Button
                  className="nav-link"
                  type="link"
                  onClick={showRegistrationModal}
                >
                  Рэгістрацыя
                </Button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item" style={{ marginRight: "20px " }}>
                <Text>
                  Імя карыстальніка: <Text strong>{getCookie("user")}</Text>
                </Text>
              </li>
              <li className="nav-item" style={{ marginRight: "20px " }}>
                <Text>
                  Колькі ачкоў: <Text strong>{getCookie("score")}</Text>
                </Text>
              </li>
              <li className="nav-item">
                <Typography.Link
                  strong
                  className="nav-link"
                  type="link"
                  onClick={leave}
                  style={{ padding: "0px " }}
                >
                  Выхад
                </Typography.Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      <section className="main">
        <div className="container">
          <div className=" rightside motivatetext">
            <span className="LyceumNavbarText">Мая краіна</span>
          </div>
          <div className="leftside startButton">
            <Button
              onClick={isLogined}
              className="learn-more"
              style={{ background: "none", border: "none" }}
            >
              <div className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </div>
              <div className="button-text">
                <div className="text">Пачаць тэст</div>
              </div>
            </Button>
          </div>
        </div>
      </section>

      <Registration
        setRegistrationModalVisible={setRegistrationModalVisible}
        RegistrationModalVisible={RegistrationModalVisible}
        visible={setRegistrationModalVisible}
        setCookiesReload={setCookiesReload}
      />
      <Login
        RegistrationModalVisible={RegistrationModalVisible}
        LoginModalVisible={LoginModalVisible}
        setLoginModalVisible={setLoginModalVisible}
        setCookiesReload={setCookiesReload}
      />
      <div className="container">
        <div className="topline">
          <img src={goldkorona} alt=""></img>
          <span>Лідэры</span>
        </div>
        <Top />
      </div>

      {/* <Arcanoid /> */}
    </div>
  );
}

export default App;
