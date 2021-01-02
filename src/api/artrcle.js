import api from "@/api/index";

export default {
  submit: (data) => {
    return api.post({ url: "/artrcle/submit", data: data });
  },
};
