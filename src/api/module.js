import api from "@/api/index";

export default {
  list: (choice, id) => {
    return api.get({ url: "/binance_data_dash/" + choice + "/" + id });
  },
  detail: () => {
    return api.get({ url: "/binance_data_detail" });
  },
  marketPlaceList: (choice) => {
    return api.get({ url: "/request_picture/" + choice });
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
  collect: (id) => {
    return api.get({ url: "/collection/" + id });
  },
  cancelCollect: (id) => {
    return api.get({ url: "/cancel_collection/" + id });
  },
};
