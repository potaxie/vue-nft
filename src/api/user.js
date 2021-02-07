import api from "@/api/index";

export default {
  getCurrentUser: () => {
    return api.syncGet({ url: "/login/session/" });
  },
  verifyEmail: (email) => {
    return api.get({ url: "/verify_email/" + email });
  },
  login: (username, password) => {
    return api.get({ url: "/login/" + username + "/" + password });
  },
  signup: (username, password, email, code) => {
    return api.get({ url: "/register/" + username + "/" + password + "/" + email + "/" + code });
  },
  logout: () => {
    return api.get({ url: "/logout/" });
  },
  update: (data) => {
    return api.post({ url: "/setting", data: data });
  },
};
