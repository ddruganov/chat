import { createRouter, createWebHistory, RouteParams, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/Main.vue"),
    children: [
      {
        path: '/',
        component: () => import("@/pages/Index.vue"),
      },
      /* ROOMS */
      {
        path: "/room/:roomId",
        component: () => import("@/pages/chat/Index.vue"),
      },
    ],
  },
  /* AUTHENTICATION */
  {
    path: "/auth",
    component: () => import("@/layout/Auth.vue"),
    children: [
      {
        path: "/auth/login",
        component: () => import("@/pages/auth/Login.vue"),
      },
      {
        path: "/auth/logout",
        component: () => import("@/pages/auth/Logout.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
