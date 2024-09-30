import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: "/",
      name: "factories",

      component: () => import("../views/FactoriesView.vue")
    },
    {
      path: '/factory/:id',
      name: 'factory-details',
      component: () => import('../components/DetailedFactory.vue')
    },
    {
      path: '/factory/:id/add-chocolate',
      name : 'add-chocolates',
      component: () => import('../components/AddChocolateToFactory.vue')

    },
    {
      path: '/factory/:id/update',
      name: 'update-factory',
      component: () => import('../components/UpdateFactory.vue')
    },
    {
      path: '/chocolate/:id/update',
      name: 'update-chocolate',
      component: () => import('../components/UpdateChocolate.vue')
    },
    {
      path: '/factory/:id/comments',
      name: 'factory-comments',
      component: () => import('../components/CommentsView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LogIn.vue')
    },
    {
      path: '/factories/create',
      name: 'create-factory',
      component: () => import('../components/CreateFactory.vue')
    },
    {
      path : '/users',
      name : 'users',
      component: () => import('../components/UsersView.vue')
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('../components/Profile.vue')
    },
    {
      path : '/factory/my',
      name : 'my-factory',
      component: () => import('../components/MyFactory.vue')
    },
    {
      path : '/factory/:id/add-worker',
      name : 'add-worker',
      component: () => import('../components/AddWorkerToFactory.vue')
      
    },
    {
      path: '/purchases',
      name: 'purchases',
      component: () => import('../components/CustomerPurchases.vue'),
      meta: { requiresAuth: true } // Ensure the route is protected
    },
    {
      path: '/managerPurchases',
      name: 'manager-purchases',
      component: () => import('../components/ManagerPurchases.vue'),
      meta: { requiresAuth: true } // Ensure the route is protected
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../components/Cart.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../components/SignUp.vue')
    }

  ]
})

export default router
