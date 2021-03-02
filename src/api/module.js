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
  marketPlaceList: (choice, symbol, keyword, page, pageSize, sort) => {
    let params = {
      choice: choice, symbol: symbol, keyword: keyword,
      page: page, pageSize: pageSize,
      sortBy: "", asc: true
    };
    if (sort) {
      params.sortBy = sort.sortBy;
      params.asc = sort.asc;
    }
    return api.get({ url: "/marketplace_list", params: params });
  },

  marketPlaceAnalysis: (choice) => {
    return api.get({ url: "/marketplace_analysis/" + choice });
  },

  //Collection
  collectionList: (choice, id) => {
    return api.get({ url: "/collection_data_dash/" + choice + "/" + id });
  },
  collectionDetail: (page, pageSize, sort) => {
    let params = {
      page: page, pageSize: pageSize,
      sortBy: "", asc: true
    };
    if (sort) {
      params.sortBy = sort.sortBy;
      params.asc = sort.asc;
    }
    return api.get({ url: "/collection_data_detail", params: params });
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

  // Forum
  searchForum: (label, page, pageSize) => {
    let params = {
      label: label,
      page: page, pageSize: pageSize,
    };
    return api.get({ url: "/forum/get_forum", params: params });
  },

};
