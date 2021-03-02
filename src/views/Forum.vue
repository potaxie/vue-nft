<template>
  <a-layout class="layout admin-layout">
    <main-header />
    <a-layout-content>
      <div class="forum">
        <a-button type="primary">发布帖子</a-button>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="all" tab="全部">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                size="middle"
              >
                <template #title="{ text }">
                  <a>{{ text }}</a>
                </template>
                <template #author="{ text }">
                  <a>{{ text }}</a>
                </template>
              </a-table>
          </a-tab-pane>
          <a-tab-pane key="notice" tab="公告" force-render>xxx 公告</a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-content>
    <a-layout-footer>Ginkgo Nft ©2020 Created by ginkgo </a-layout-footer>
  </a-layout>
</template>
<script>
import { StarOutlined, StarFilled } from "@ant-design/icons-vue";
import MainHeader from "@/components/MainHeader";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import api from "@/api/module";

const columns = [
  {
    title: "Read",
    dataIndex: "read",
  },
  {
    title: "Comment",
    dataIndex: "comment",
  },
  {
    title: "Title",
    dataIndex: "title",
    ellipsis: true,
    slots: {
      customRender: "title",
    },
  },
  {
    title: "Author",
    dataIndex: "author",
    ellipsis: true,
    slots: {
      customRender: "author",
    },
  },
  {
    title: "Last Modify",
    dataIndex: "lastModify",
  },
];
export default {
  components: {
    MainHeader,
    StarOutlined,
    StarFilled,
  },
  data() {
    return {
      activeKey: "all",
      data: [],
      columns,
      pagination: {
        onChange: (page) => {
          this.pagination.current = page;
          this.search();
        },
        total: 0,
        current: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
    labelName() {
      return this.$route.query.label;
    },
  },
  watch: {
    labelName() {
      this.search();
    },
  },
  methods: {
    search() {
      api
        .searchForum(this.labelName, this.pagination.current, this.pagination.pageSize)
        .then((res) => {
          this.pagination.total = res.data.total;
          this.data = res.data.result_list;
        });
    },
  },
  created() {
    if (this.labelName) {
      this.search();
    }
  },
};
</script>
<style lang="less">
.forum {
  text-align: left;
}
</style>
