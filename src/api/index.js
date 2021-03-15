import axios from "axios";
import vuex from '../store';
import { message } from "ant-design-vue";
let baseURL = "/app";

let get = axios.create({
  method: "GET",
  baseURL: baseURL,
});

let post = axios.create({
  method: "POST",
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

get.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      vuex.dispatch('setCurrentUser', null);
      message.error("Please login first...");
    }
  }
);

post.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      vuex.dispatch('setCurrentUser', null);
      message.error("Please login first...");
    }
  }
);

let syncGet = (opts) => {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(opts.method || "GET", baseURL + opts.url, false);
  xmlhttp.send(null);
  return JSON.parse(xmlhttp.responseText);
};

export default {
  get,
  post,
  syncGet,
};

