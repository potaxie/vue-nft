import api from "@/api/index";

export default {
  //NftWork
  imageGroups: () => {
    return api.get({ url: "/request_picture_groups/test" });
  },

  imageDetail: (id) => {
    return api.get({ url: "/request_picture_detail/" + id });
  },

  nftWorkCollect: (id) => {
    return api.get({ url: "/collection/" + id });
  },
  nftWorkCancelCollect: (id) => {
    return api.get({ url: "/cancel_collection/" + id });
  },

  //MarketPlace
  marketPlaceList: (choice) => {
    return api.get({ url: "/request_picture/" + choice });
  },

  marketPlaceAnalysis: (choice) => {
    return api.get({ url: "/request_picture_analysis/" + choice });
  },

  //Collection
  collectionList: (choice, id) => {
    return api.get({ url: "/collection_data_dash/" + choice + "/" + id });
  },
  collectionDetail: () => {
    return api.get({ url: "/collection_data_detail" });
  },

  //Blog
};
