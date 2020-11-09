import React, { Component } from "react";
import {
  ballRadius,
  paddleHeight,
  paddleWidth,
  brickRowCount,
  brickColumnCount,
  brickWidth,
  brickHeight,
  brickPadding,
  brickOffsetTop,
  brickOffsetLeft,
} from "./constants.js";
import "./arcanoid.css";
let canvas;
let ctx;
let paddleX;
let bricks = [];
let lives = 3;
let score = 0;
let x;
let y;
let dx = 4;
let dy = -4;

export default class Arcanoid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamestate: "level1",
      isLeftPressed: false,
      isRightPressed: false,
      lives: lives,
      score: score,
    };
    this.leftPressed = this.leftPressed.bind(this);
    this.rightPressed = this.rightPressed.bind(this);
    this.leftUp = this.leftUp.bind(this);
    this.rightUp = this.rightUp.bind(this);
    this.draw = this.draw.bind(this);
    this.drawBricks = this.drawBricks.bind(this);
    this.drawBall = this.drawBall.bind(this);
    this.drawPaddle = this.drawPaddle.bind(this);
    this.drawScore = this.drawScore.bind(this);
    this.drawLives = this.drawLives.bind(this);
    this.collisionDetection = this.collisionDetection.bind(this);
  }

  componentDidMount() {
    canvas = document.querySelector("#game");
    ctx = canvas.getContext("2d");

    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const leftPressed = this.leftPressed;
    const rightPressed = this.rightPressed;
    const rightUp = this.rightUp;
    const leftUp = this.leftUp;

    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 39) {
        rightPressed();
      } else if (e.keyCode === 37) {
        leftPressed();
      }
    });
    window.addEventListener("keyup", function (e) {
      if (e.keyCode === 39) {
        rightUp();
      } else if (e.keyCode === 37) {
        leftUp();
      }
    });
    window.addEventListener("mousemove", function (e) {
      let relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    });
    this.draw();
  }

  leftPressed() {
    this.setState({ isLeftPressed: true });
  }
  rightPressed() {
    this.setState({ isRightPressed: true });
  }
  leftUp() {
    this.setState({ isLeftPressed: false });
  }
  rightUp() {
    this.setState({ isRightPressed: false });
  }

  collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
            this.setState({ score: score });
            if (score === brickRowCount * brickColumnCount) {
              this.setState({ gamestate: "winner" });
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }
  drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }
  drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 3;
          dy = -3;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
    if (this.state.isRightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (this.state.isLeftPressed && paddleX > 0) {
      paddleX -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(this.draw);
  }

  render() {
    return <canvas id="game" width="400" height="320" />;
  }
}
