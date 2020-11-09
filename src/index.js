import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import Switch from "react-bootstrap/esm/Switch";
import Test from "./Test/Test";
import Admin from "./Admin/Admin";
import SecondTest from "./SecondTest/secondTest";

export function setCookie(name, value, options = {}) {
  options = {
    path: "/",

    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
export function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
export function deleteCookie(name) {
  setCookie(name, "", {
    "max-age": -1,
  });
}

ReactDOM.render(
  <BrowserRouter>
    <Switch style={{ padding: "0" }}>
      <Route exact path="/" component={App}></Route>

      <Route path="/test" component={Test}></Route>

      <Route path="/admin" component={Admin}></Route>
      <Route path="/secondTest" component={SecondTest}></Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
