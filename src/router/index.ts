import { createRouter, createWebHistory } from "vue-router";
import { redirectIfAuthenticated, requiresAuth } from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // raiz de la app
    {
      path: "/",
      redirect: "/home",
    },

    // pagina publica
    {
      path: "/home",
      name: "Home",
      component: () => import("@/pages/dashboard/HomePage.vue"),
    },

    // login
    {
      path: "/login",
      component: () => import("@/layouts/AuthLayout.vue"),
      beforeEnter: redirectIfAuthenticated,

      children: [
        {
          path: "",
          name: "login",
          component: () => import("@/pages/auth/LoginPage.vue"),
        },
      ],
    },

    // register
    {
      path: "/register",
      component: () => import("@/layouts/AuthLayout.vue"),
      beforeEnter: redirectIfAuthenticated,
      children: [
        {
          path: "",
          name: "Register",
          component: () => import("@/pages/auth/RegisterPage.vue"),
        },
      ],
    },

    // authenticated required
    {
      path: "/",
      component: () => import("@/layouts/DefaultLayout.vue"),
      beforeEnter: requiresAuth,
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/pages/dashboard/DashboardPage.vue"),
          meta: { title: "Dashboard" },
        },
        {
          path: "exams",
          name: "ExamList",
          component: () => import("@/pages/exams/ExamListPage.vue"),
          meta: { title: "Exámenes" },
        },
        {
          path: "exams/:id",
          name: "ExamDetail",
          component: () => import("@/pages/exams/ExamDetailPage.vue"),
          meta: { title: "Detalle del Examen" },
        },
        {
          path: "results",
          name: "Results",
          component: () => import("@/pages/results/ResultsPage.vue"),
          meta: { title: "Resultados" },
        },
        {
          path: "settings",
          name: "Settings",
          component: () => import("@/pages/settings/SettingsPage.vue"),
          meta: { title: "Configuración" },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/pages/NotFoundPage.vue"),
    },
  ],
});

router.afterEach((to) => {
  const title = to.meta.title as string;
  document.title = title
    ? `${title} | ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME;
});

export default router;
