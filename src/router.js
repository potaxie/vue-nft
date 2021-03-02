import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./views/Login";
import NftWork from "./views/NftWork";
import MarketPlace from "./views/MarketPlace";
import Collection from "./views/Collection";
import Blog from "./views/Blog";
import Forum from "./views/Forum";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: NftWork,
  },
  {
    path: "/market-place",
    name: "MarketPlace",
    component: MarketPlace,
  },
  {
    path: "/collection",
    name: "Collection",
    component: Collection,
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/forum",
    name: "Forum",
    component: Forum,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
