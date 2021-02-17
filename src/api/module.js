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
  marketPlaceList: (choice, symbol) => {
    return api.get({ url: "/request_picture/" + choice + "/" + symbol });
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
  submit: (data) => {
    return api.post({ url: "/article/submit", data: data });
  },
  list: (page, limit) => {
    return api.get({ url: "/article/submit/reback?page=" + page + "&limit=" + limit });
  },
  like: (id) => {
    return api.get({ url: "/article/star/" + id });
  },
  unlike: (id) => {
    return api.get({ url: "/article/cancel_star/" + id });
  },
  comments: (id) => {
    return api.get({ url: "/article/comments/" + id });
  },
  submitComment: (id, myComment) => {
    return api.post({
      url: "/article/submit_comment",
      data: { id: id, comment: myComment },
    });
  },
};
