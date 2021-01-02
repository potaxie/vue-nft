import api from "@/api/index";

export default {
  list: (choice) => {
    return api.get({ url: "/binance_data_dash/" + choice });
  },
  detail: (date) => {
    return api.get({ url: "/binance_data_detail/" + date });
  },
  marketPlaceList: () => {
    return api.get({ url: "/request_picture/test" });
  },
  marketPlaceDetail: (id) => {
    return api.get({ url: "/request_picture_detail/" + id });
  },
  marketPlaceAnalysis: (choice) => {
    return api.get({ url: "/request_picture_analysis/" + choice });
  },
  imageGroups: () => {
    return api.get({ url: "/request_picture_groups/test" });
  },
};
