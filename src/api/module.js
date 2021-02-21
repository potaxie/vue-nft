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
  marketPlaceList: (choice, symbol, keyword, page, pageSize) => {
    return api.get({
      url: "/marketplace_list", params: {
        choice: choice, symbol: symbol, keyword: keyword,
        page: page, pageSize: pageSize
      }
    });
  },

  marketPlaceAnalysis: (choice) => {
    return api.get({ url: "/marketplace_analysis/" + choice });
  },

  //Collection
  collectionList: (choice, id) => {
    return api.get({ url: "/collection_data_dash/" + choice + "/" + id });
  },
  collectionDetail: (page, pageSize) => {
    return api.get({
      url: "/collection_data_detail", params: {
        page: page, pageSize: pageSize
      }
    });
  },

  //Blog
  submit: (data) => {
    return api.post({ url: "/article/submit", data: data });
  },
  list: (page, pageSize) => {
    return api.get({ url: "/article/submit/reback?page=" + page + "&pageSize=" + pageSize });
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
