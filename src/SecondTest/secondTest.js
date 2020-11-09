import { Button, Calendar, message, Popconfirm, Tag } from "antd";
import Modal from "antd/lib/modal/Modal";
import React from "react";
import yStart from "./yandexMap";
import moment from "moment";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import { getCookie, setCookie } from "../index";

export default class SecondTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        {
          question_title: "",
          question: "",
          question_answer: "2000-10",
          about_truth: "",
          link3d:undefined
        },
      ],
      currentQuestion: 0,
      visible: false,
      value: "1960",
      randomModalVisible: false,
      localScore: 0,
      globalScore: 0,
      attempts: 0,
      tags: [],
      ymapProps: [
        { name: "Brest Region", color: null },
        { name: "Vitebsk Region", color: null },
        { name: "Gomel Region", color: null },
        { name: "Grodno Region", color: null },
        { name: "Minsk Region", color: null },
        { name: "Mogilev Region", color: null },
      ],
      features: [
        {
          type: "Feature",
          id: 0,
          geometry: {
            type: "Point",
            coordinates: [52.20140512033498, 24.166073320937095],
          },
          properties: {
            balloonContent: "Брест",
            iconContent: "Брест",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
          },
        },
        {
          type: "Feature",
          id: 1,
          geometry: {
            type: "Point",
            coordinates: [55.164962794949666, 30.206477725401516],
          },
          properties: {
            balloonContent: "Витебск",
            iconContent: "Витебск",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
          },
        },
        {
          type: "Feature",
          id: 2,
          geometry: {
            type: "Point",
            coordinates: [52.42112977642907, 31.041438662901477],
          },
          properties: {
            balloonContent: "Гомель",
            iconContent: "Гомель",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
          },
        },
        {
          type: "Feature",
          id: 3,
          geometry: {
            type: "Point",
            coordinates: [53.47857270793706, 25.06695222718893],
          },
          properties: {
            balloonContent: "Гродно",
            iconContent: "Гродно",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
          },
        },
        {
          type: "Feature",
          id: 4,
          geometry: {
            type: "Point",
            coordinates: [53.90003168897394, 27.564265811339027],
          },
          properties: {
            balloonContent: "Минск",
            iconContent: "Минск",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
            iconSize: [30, 42],
            radius: 25,
          },
        },

        {
          type: "Feature",
          id: 5,
          geometry: {
            type: "Point",
            coordinates: [53.887053175792914, 30.349299991026484],
          },
          properties: {
            balloonContent: "Могилев",
            iconContent: "Могилев",
            hintContent: "Нажми чтобы выполнить задание и получить очки",
          },
          options: {
            preset: "islands#blueStretchyIcon",
          },
        },
      ],
      nextModalVisible: false,
      descriptionVisible: false,
    };
  }
  componentDidMount() {
    if (sessionStorage.getItem("selectedTest") === "1") {
      fetch("https://app.kangreon.ru/liceum/testmapculturequestions/")
        .then((response) => response.json())
        .then((r) => {
          console.log(r);
          this.setState({
            questions: r.testculuture,
          });
        });
      console.log("asd");
    } else {
      fetch("https://app.kangreon.ru/liceum/gettest2data/")
        .then((response) => response.json())
        .then((r) => {
          console.log(r);
          this.setState({
            questions: r.test2,
          });
        });
    }

    this.editYmapProps(this.state.features);
  }
  editYmapProps = (filtred) => {
    yStart({
      clickHandler: this.clickHandler,
      ymapProps: this.state.ymapProps,
      features: filtred,
    });
  };
  clickHandler = (id) => {
    let date = moment(
      `${
        parseInt(
          moment(
            this.state.questions[this.state.currentQuestion].question_answer
          ).format("YYYY")
        ) - 1
      }-08-22`
    );
    this.setState({
      value: date,
      currentQuestion: id,
      visible: true,
      localScore: 0,
      attempts: 0,
    });
  };
  onCancel = () => {
    this.validateYProps(false);

    this.setState({ visible: !this.state.visible });

    if (this.state.features.length - 1 === 0) {
      this.setState({ nextModalVisible: true });
    }
  };

  onSelect = (value) => {
    this.setState({
      value,
      selectedValue: value,
    });
  };

  onPanelChange = (value) => {
    this.setState({ value });
  };

  validateYProps = (jackpot) => {
    const { currentQuestion, ymapProps, features } = this.state;
    let filtred = features.filter((el) => {
      return el.id !== currentQuestion;
    });

    if (jackpot) {
      ymapProps[currentQuestion].color = "#26db12";
      this.setState({
        ymapProps: [...ymapProps],
        features: filtred,
      });
      this.editYmapProps(filtred);
    } else {
      ymapProps[currentQuestion].color = "#ff0000";
      this.setState({
        ymapProps: [...ymapProps],
        features: [...filtred],
      });
      this.editYmapProps(filtred);
    }
  };
  onSuccess = () => {
    const {
      questions,
      currentQuestion,
      value,
      globalScore,
      localScore,
      attempts,
      features,
    } = this.state;
    console.log(features);
    if (
      moment(questions[currentQuestion].question_answer).format("MMM  YYYY") !==
        value.format("MMM  YYYY") &&
      attempts < 5
    ) {
      this.setState({
        tags: this.generateTegs(),
        visible: !this.state.visible,
        randomModalVisible: true,
        attempts: this.state.attempts + 1,
      });
    } else if (attempts === 5) {
      this.setState({
        globalScore: globalScore + localScore,
        visible: !this.state.visible,
        descriptionVisible: true,
      });

      message.success(`
      Поздравляем за этот вопрос вы получаете: ${localScore}
      А всего у вас: ${globalScore + localScore}
      `);
      if (features.length - 1 === 0) {
        this.setState({ nextModalVisible: true });
      }
    } else if (
      moment(questions[currentQuestion].question_answer).format("MMM  YYYY") ===
      value.format("MMM  YYYY")
    ) {
      this.setState({
        globalScore: globalScore + localScore + 30,
        visible: !this.state.visible,
      });

      this.validateYProps(true);
      message.success(`
      Поздравляем за этот вопрос вы получаете: ${localScore + 30}
      А всего у вас: ${globalScore + 30}
      `);
      if (features.length - 1 === 0) {
        this.setState({ nextModalVisible: true });
      }
    }
  };
  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  };
  generateTegs = () => {
    const { questions, currentQuestion, value, localScore } = this.state;
    let diaposonStart = moment(
      `${
        parseInt(
          moment(
            this.state.questions[this.state.currentQuestion].question_answer
          ).format("YYYY")
        ) - 2
      }`
    ).format("YYYY");
    let diaposonEnd = moment(
      `${
        parseInt(
          moment(
            this.state.questions[this.state.currentQuestion].question_answer
          ).format("YYYY")
        ) + 2
      }`
    ).format("YYYY");
    console.log(diaposonEnd, diaposonStart);
    let dates = [value];
    for (let index = 0; index < 3; index++) {
      dates.push(
        moment(
          `${this.getRandomInt(diaposonStart, diaposonEnd)}-${this.getRandomInt(
            1,
            12
          )}`
        )
      );
    }

    //dates.sort((a, b) => a.diff(b));
    let closest;
    let diff = Infinity;
    dates.forEach((el) => {
      let truth = moment(questions[currentQuestion].question_answer);

      if (Math.abs(el.diff(truth)) < diff) {
        diff = Math.abs(el.diff(truth));
        closest = el;
      }
    });

    let tags = dates.map((el) => {
      return el.format("MMM  YYYY") === value.format("MMM  YYYY") &&
        el.format("MMM  YYYY") === closest.format("MMM  YYYY") ? (
        <Tag
          color="green"
          style={{ border: "1px solid black", marginRight: "5px" }}
        >
          {el.format("MMM  YYYY")}{" "}
        </Tag>
      ) : el.format("MMM  YYYY") === closest.format("MMM  YYYY") ? (
        <Tag color="green">{el.format("MMM  YYYY")}</Tag>
      ) : el.format("MMM  YYYY") === value.format("MMM  YYYY") ? (
        <Tag
          color="red"
          style={{ border: "1px solid black", marginRight: "5px" }}
        >
          {el.format("MMM  YYYY")}{" "}
        </Tag>
      ) : (
        <Tag color="red">{el.format("MMM  YYYY")}</Tag>
      );
    });
    if (value.format("MMM  YYYY") === closest.format("MMM  YYYY")) {
      this.setState({ localScore: localScore + 4 });
    }
    return tags;
  };
  onRandomSuccess = () => {
    this.setState({
      randomModalVisible: false,
      visible: true,
    });
  };
  render() {
    const {
      visible,
      currentQuestion,
      questions,
      value,
      randomModalVisible,
    } = this.state;
    console.log(this.state);
    return (
      <div>
        <Modal
          title={questions[currentQuestion].question_title}
          centered
          visible={visible}
          width={"75%"}
          footer={
            <div>
              <Popconfirm
                title="Вы уверенны? При выходe из вопроса вы не получите баллов!"
                okText="Да"
                onConfirm={this.onCancel}
                cancelText="Нет"
              >
                <Button type="primary">Выйти</Button>
              </Popconfirm>

              <Button onClick={this.onSuccess} type="primary">
                Ответить
              </Button>
            </div>
          }
        >
          <div>
            <span>{questions[currentQuestion].question}</span>
            <Calendar
              value={value}
              onSelect={this.onSelect}
              onPanelChange={this.onPanelChange}
              locale={locale}
              mode="year"
              validRange={
                sessionStorage.getItem("selectedTest") === "1"
                  ? [moment("1941-06-22"), moment("1945-05-08")]
                  : [
                      moment(
                        `${
                          parseInt(
                            moment(
                              this.state.questions[this.state.currentQuestion]
                                .question_answer
                            ).format("YYYY")
                          ) - 2
                        }-06-22`
                      ),
                      moment(
                        `${
                          parseInt(
                            moment(
                              this.state.questions[this.state.currentQuestion]
                                .question_answer
                            ).format("YYYY")
                          ) + 2
                        }-05-08`
                      ),
                    ]
              }
            />
          </div>
        </Modal>
        <Modal
          title="Случайные ответы"
          centered
          visible={randomModalVisible}
          footer={
            <Button onClick={this.onRandomSuccess} type="primary">
              Попробовать еще
            </Button>
          }
        >
          <div>
            <h4>Секция со слуайными ответами</h4>
            <span>
              Здесь показывается наиболее близкий ответ(сгенерированный
              случайно), у вас отслось попыток{" "}
              {Math.abs(this.state.attempts - 5)}
            </span>

            <div style={{ marginTop: "20px" }}>
              {this.state.tags.map((el, index) => {
                if (index === 0) {
                  return (
                    <div>
                      <span>{getCookie("user")}: </span>
                      {el}{" "}
                    </div>
                  );
                }
                if (index === 1) {
                  return (
                    <div>
                      <span>Bot Ваня: </span>
                      {el}{" "}
                    </div>
                  );
                }
                if (index === 2) {
                  return (
                    <div>
                      <span>Bot Вова: </span>
                      {el}{" "}
                    </div>
                  );
                }
                if (index === 3) {
                  return (
                    <div>
                      <span>Bot Паша: </span>
                      {el}{" "}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </Modal>
        <Modal
          visible={this.state.nextModalVisible}
          onOk={() => {
            this.setState({ nextModalVisible: false });
            if (sessionStorage.getItem("selectedTest") === "2") {
             
              sessionStorage.setItem("selectedTest", 1);
              this.props.history.push("/test");
            } else if (sessionStorage.getItem("selectedTest") === "1") {
              fetch("https://app.kangreon.ru/liceum/setscore/", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  score: this.state.globalScore + parseInt(getCookie("score")),
                  name: getCookie("user"),
                }),
              });
              setCookie(
                "score",
                this.state.globalScore + parseInt(getCookie("score"))
              );
              this.props.history.push("/");
            }
          }}
          onCancel={() => {
            fetch("https://app.kangreon.ru/liceum/setscore/", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                score: this.state.globalScore + parseInt(getCookie("score")),
                name: getCookie("user"),
              }),
            });
            setCookie(
              "score",
              this.state.globalScore + parseInt(getCookie("score"))
            );
            this.props.history.push("/");
          }}
        >
          {sessionStorage.getItem("selectedTest") === "1"
            ? "Поздравляем вы прошли тест"
            : "Поздравлем вы прошли первый тест, не желаете ли пройти второй тест связанный с культурой ?"}
        </Modal>
        <Modal
          title={"Правильный ответ с описанием"}
          visible={this.state.descriptionVisible}
          onOk={() => {
            this.setState({ descriptionVisible: false });
            this.validateYProps(false);
          }}
          onCancel={() => {
            this.setState({ descriptionVisible: false });
            this.validateYProps(false);
          }}
        >
          {this.state.questions[this.state.currentQuestion].about_truth}
          <br/>
          <br/>
          <br/>
          <br/>
          {this.state.questions[this.state.currentQuestion].link3d!== undefined ?
           <Button type='link' href={this.state.questions[this.state.currentQuestion].link3d} targrt='_blank'> Ссылка на панараму обьекта </Button>: <span>Для данного вопроса панарама отсутствует</span>}
          <div id="panorama"></div>
        </Modal>
        <div id="ymap" style={{ width: "100%", height: "100vh" }}></div>
      </div>
    );
  }
}
