import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => ({ name: 'chat' })
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        name: 'register',
        meta: { guestOnly: true }
      }
    ]
  },
  {
    path: '/chat',
    meta: { requiresAuth: true },
    component: () => import('layouts/ChatLayout.vue'),
    children: [
      {
        path: ':channel?',
        component: () => import('pages/ChatPage.vue'),
        name: 'chat',
        meta: { title: null }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not_found',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
