import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/assessment/basic',
      name: 'basicAssessment',
      component: () => import('../views/BasicAssessmentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assessment/detailed/:dimension',
      name: 'detailedAssessment',
      component: () => import('../views/DetailedAssessmentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/ResultView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('../views/EmergencyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ai-counseling',
      name: 'aiCounseling',
      component: () => import('../views/AICounselingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mental-aid',
      name: 'mentalAid',
      component: () => import('../views/MentalAidView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('../views/admin/LoginView.vue')
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/questions',
      name: 'adminQuestions',
      component: () => import('../views/admin/QuestionsView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/dimensions',
      name: 'adminDimensions',
      component: () => import('../views/admin/DimensionsView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/advice',
      name: 'adminAdvice',
      component: () => import('../views/admin/AdviceView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/emergency',
      name: 'adminEmergency',
      component: () => import('../views/admin/EmergencyView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/statistics',
      name: 'adminStatistics',
      component: () => import('../views/admin/StatisticsView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAdminRoute = to.matched.some(record => record.meta.isAdmin)
  const isAdminLoggedIn = localStorage.getItem('adminToken')
  const isUserLoggedIn = localStorage.getItem('currentUser')
  
  if (requiresAuth) {
    if (isAdminRoute) {
      // 管理员路由
      if (!isAdminLoggedIn) {
        next('/admin/login')
      } else {
        next()
      }
    } else {
      // 普通用户路由
      if (!isUserLoggedIn) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router