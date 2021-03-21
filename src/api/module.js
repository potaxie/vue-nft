import api from "@/api/index";

export default {
  //NftWork
  imageGroups: () => {
    return api.get({ url: "/request_picture_groups" });
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
  getBlogDetail: (id) => {
    return api.get({ url: "/article/submit/reback_article?id=" + id });
  },
  deleteBlog: (id) => {
    return api.get({ url: "/article/delete_article?id=" + id });
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
  getForumTitle: (label) => {
    return api.get({ url: "/forum/get_forum_title?label=" + label });
  },

  clockInForum: (label) => {
    return api.get({ url: "/forum/clock_in?label=" + label });
  },

  getClockInfoForum: (label) => {
    return api.get({ url: "/forum/get_clock_info?label=" + label });
  },

  starForum: (id) => {
    return api.get({ url: "/forum/star/" + id });
  },
  deleteForum: (id) => {
    return api.get({ url: "/forum/delete_forum?id=" + id });
  },
  searchForum: (label, page, pageSize) => {
    let params = {
      label: label,
      page: page, pageSize: pageSize,
    };
    return api.get({ url: "/forum/get_forum", params: params });
  },

  submitForum: (data) => {
    return api.post({ url: "/forum/submit_forum", data: data });
  },

  getForumDetail: (id) => {
    return api.get({ url: "/forum/get_forum_content?id=" + id });
  },

  getForumComments: (id) => {
    return api.get({ url: "/forum/get_forum_comments?id=" + id });
  },

  submitForumComment: (id, comment) => {
    return api.post({
      url: "/forum/submit_forum_comment", data: {
        id: id,
        comment: comment
      }
    });
  }
};
