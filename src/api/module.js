import api from "@/api/index";

export default {
  list: (choice) => {
    return api.get({ url: "/binance_data_dash/" + choice });
  },
  detail: (date) => {
    return api.get({ url: "/binance_data_detail/" + date });
  },
};
