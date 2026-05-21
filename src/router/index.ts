import { createRouter, createWebHistory } from "vue-router";
import { redirectIfAuthenticated, requiresAuth } from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: () => import("@/pages/dashboard/HomePage.vue"),
    },
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
    {
      path: "/dashboard",
      component: () => import("@/layouts/DefaultLayout.vue"),
      beforeEnter: requiresAuth,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/pages/dashboard/DashboardPage.vue"),
          meta: { title: "Dashboard" },
        },
        {
          path: "files",
          name: "FileList",
          component: () => import("@/pages/files/FileListPage.vue"),
          meta: { title: "Archivos" },
        },
        {
          path: "exams",
          name: "ExamList",
          component: () => import("@/pages/exams/ExamListPage.vue"),
          meta: { title: "Exámenes" },
        },
        {
          path: "exams/create/:documentId",
          name: "CreateExamConfig",
          component: () => import("@/pages/exams/CreateExamConfigPage.vue"),
          meta: { title: "Configurar Examen" },
        },
        {
          path: "exams/:id",
          name: "ExamDetail",
          component: () => import("@/pages/exams/ExamDetailPage.vue"),
          meta: { title: "Detalle de Examen" },
        },
        {
          path: "exams/:id/session",
          name: "ExamSession",
          component: () => import("@/pages/exams/ExamSessionPage.vue"),
          meta: { title: "Resolviendo Examen" },
        },
        {
          path: "results/:id",
          name: "Results",
          component: () => import("@/pages/results/ResultsPage.vue"),
          meta: { title: "Resultados" },
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/pages/profile/ProfilePage.vue"),
          meta: { title: "Perfil" },
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

export default router;
