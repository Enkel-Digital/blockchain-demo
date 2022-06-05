import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

export default createRouter({
  history: createWebHashHistory(),

  // Always scroll to top of view on first visit and no savedPosition, else reuse savedPosition
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { top: 0 };
  },

  /**
   * @notice
   * Routes uses lazily loaded components with route level code-splitting
   * this generates a separate chunk (about.[hash].js) for this route
   * which is lazy-loaded when the route is visited.
   */
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/hash",
      name: "hash",
      component: () => import("../views/Hash.vue"),
    },
    {
      path: "/pow",
      name: "pow",
      component: () => import("../views/POW.vue"),
    },
    {
      path: "/signatures",
      name: "signatures",
      component: () => import("../views/Signatures.vue"),
    },

    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("../views/404.vue"),
    },
  ],
});
