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
import MobilePage from "./views/MobilePage";

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
  },
  {
    path: "/mobile",
    name: "MobilePage",
    component: MobilePage,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  var isMobile = /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)
  if (isMobile && !to.path.startsWith("/mobile")) {
    // 移动端
    next('/mobile');
  } else if (!isMobile && to.path.startsWith("/mobile")) {
    // PC端
    next('/');
  } else {
    next();
  }
})

export default router;
