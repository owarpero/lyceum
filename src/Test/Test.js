import { Button, message, Steps } from "antd";
import React from "react";
import "./test.css";

import Modal from "antd/lib/modal/Modal";
import { setCookie } from "../index";

export default class extends React.Component {
  constructor(props) {
    super(props);
    let arr = ["process"];
    for (let i = 0; i < 20; i++) {
      arr.push("wait");
    }
    this.state = {
      infoTest: [
        {
          id: 0,
          linkongooglemaps: "",
          numonlist: 0,
          question: "",
          truth: "",
          truthvariantimage: "",
          variants_set: ["", "", "", ""],
        },
      ],
      qestionStatus: arr,
      currentQestionIndex: 0,
      backgroundColor: "",
      visible: "",
      score: 0,
      rulesVisible: false,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("selectedTest") === "1") {
      fetch("https://app.kangreon.ru/liceum/testprocess")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ infoTest: data });
        });
    } else {
      fetch("https://app.kangreon.ru/liceum/testprocessculture")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ infoTest: data });
        });
    }
  }

  handelCkick = (e) => {
    const { infoTest, currentQestionIndex } = this.state;

    e.target.id === infoTest[currentQestionIndex].truth
      ? this.truthQestion(true)
      : this.truthQestion(false);
  };
  truthQestion = (bool) => {
    const { qestionStatus, currentQestionIndex } = this.state;
    if (!bool) {
      qestionStatus.splice(currentQestionIndex, 1, "error");

      this.setState({
        backgroundColor: "rgb(255,123,123,0.7)",
        visible: true,
        qestionStatus: qestionStatus,
      });
    } else {
      qestionStatus.splice(currentQestionIndex, 1, "finish");

      this.setState({
        backgroundColor: "rgb(123,255,123,0.7)",
        visible: true,
        score: this.state.score + 15,
        qestionStatus: qestionStatus,
      });
    }
  };
  async setscore(score) {
    message.success(`Ваш результат за первый тест: ${score} очков!`);

    setCookie("score", score);
    this.setState({ visible: false, rulesVisible: true });
  }

  setVisible = () => {
    const { infoTest, currentQestionIndex, score, qestionStatus } = this.state;
    qestionStatus.splice(currentQestionIndex + 1, 1, "process");
    infoTest[currentQestionIndex + 1] === undefined
      ? this.setscore(score)
      : this.setState({
          visible: !this.state.visible,
          currentQestionIndex: this.state.currentQestionIndex + 1,
          qestionStatus: qestionStatus,
        });
  };
  googleLink = () => {
    window.open(
      this.state.infoTest[this.state.currentQestionIndex].linkongooglemaps,
      "_blank"
    );
  };
  nextTest = () => {
    this.props.history.push("/secondTest");
  };
  render() {
    return (
      <div>
        <div className="map">
          <p className="titlemap">
            <span>KAPTA</span>
          </p>

          <div className="mapcontent">
            <div className="mapppoints">
              <Steps
                direction="vertical"
                current={this.state.currentQestionIndex}
                status="process"
              >
                {this.state.infoTest.map((el, index) => (
                  <Steps.Step
                    key={index}
                    status={this.state.qestionStatus[index]}
                  ></Steps.Step>
                ))}
              </Steps>
            </div>
            <div className="wrapperquestion">
              <p className="question">
                {this.state.infoTest[this.state.currentQestionIndex].question}
              </p>
              <div className="questionvariatsanswer">
                {this.state.infoTest[
                  this.state.currentQestionIndex
                ].variants_set.map((index) => {
                  const { currentQestionIndex } = this.state;

                  return (
                    <div
                      className="answerchoice"
                      onClick={this.handelCkick}
                      data-tag={
                        this.state.infoTest[currentQestionIndex].variants_set[
                          index
                        ]
                      }
                      id={index}
                    >
                      {index}
                    </div>
                  );
                })}
              </div>
              <Modal
                maskStyle={{ backgroundColor: this.state.backgroundColor }}
                width={"70%"}
                title={
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "1.9vw",
                    }}
                  >
                    {this.state.currentQuestion}
                  </span>
                }
                centered
                visible={this.state.visible}
                onOk={this.setVisible}
                onCancel={this.setVisible}
                footer={[
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "0.6vw",
                      width: "100%",
                    }}
                  >
                    <Button
                      key="submit"
                      type="primary"
                      onClick={this.setVisible}
                    >
                      Следующий вопрос
                    </Button>
                  </div>,
                ]}
              >
                <div
                  onClick={this.googleLink}
                  style={{
                    backgroundImage:
                      "url(" +
                      this.state.infoTest[this.state.currentQestionIndex]
                        .truthvariantimage +
                      ")",
                    height: "50vh",
                  }}
                  class="answerimage"
                ></div>
                <span style={{ fontSize: "20px" }}>
                  {this.state.infoTest[this.state.currentQestionIndex].truth}
                </span>
              </Modal>
              <Modal
                width={"70%"}
                title={
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "1.9vw",
                    }}
                  >
                    Правила второго теста
                  </span>
                }
                visible={this.state.rulesVisible}
                centered
                footer={
                  <Button type="primary" onClick={this.nextTest}>
                    Пройти следующий тест
                  </Button>
                }
              >
                1.Перед вами появится карта беларуси <br />
                2.Нажимая на маркер региона вы должны ответить на вопрос выбрав
                дату в календаре <br />
                3.Затем если вы не угадали вы попадете в секцию со случайными
                ответами. Где будет ваш ответ и ваших соперников
                <br />
                4.Ближайший ответ к правильному подсветится зеленым(это
                подсказка для вас, что бы вы в следующих раунда быстрее нашли
                верный ответ)
                <br />
                5.Если вы преждевременно выходите из теста то проигрываете
                регион
                <br />
                6.Удачи)
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
