import { createRouter, createWebHistory, RouteParams, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/layout/Main.vue"),
    children: [
      /* HOME */
      {
        path: "/",
        component: () => import("@/pages/home/Index.vue"),
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
        props: (route: RouteParams) => ({ backurl: (route.query as any).backurl }),
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
