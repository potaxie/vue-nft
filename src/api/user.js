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
  signup: (data) => {
    return api.post({ url: "/register", data: data });
  },
  logout: () => {
    return api.get({ url: "/logout/" });
  },
  update: (data) => {
    return api.post({ url: "/setting", data: data });
  },
  submitFeedback: (data) => {
    return api.post({ url: "/feedback", data: data });
  },
};
