import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./views/Login";
import NftWork from "./views/NftWork";
import MarketPlace from "./views/MarketPlace";
import Collection from "./views/Collection";
import Blog from "./views/Blog";
import Forum from "./views/Forum";
import ForumContent from "./views/ForumContent";
import BlogContent from "./views/BlogContent";
import AboutUs from "./views/AboutUs";

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
    path: "/blog-content",
    name: "BlogContent",
    component: BlogContent,
  },
  {
    path: "/forum",
    name: "Forum",
    component: Forum,
  },
  {
    path: "/forum-content",
    name: "ForumContent",
    component: ForumContent,
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: AboutUs,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
