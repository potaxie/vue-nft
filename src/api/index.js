import axios from "axios";
// let baseURL = '/backend';
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

let put = axios.create({
  method: "PUT",
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

let del = axios.create({
  method: "DELETE",
  baseURL: baseURL,
});

let syncGet = (opts) => {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open(opts.method || "GET", baseURL + opts.url, false);
  xmlhttp.send(null);
  return JSON.parse(xmlhttp.responseText);
};

export default {
  get,
  post,
  put,
  del,
  syncGet,
};
