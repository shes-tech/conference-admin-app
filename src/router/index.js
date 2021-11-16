import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/recover-password',
    name: 'RecoverPassword',
    component: () => import(/* webpackChunkName: "login" */ '@/views/RecoverPassword.vue'),
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "main" */ '@/views/BasePage.vue'),
    children: [
      {
        path: '/menu',
        name: 'Menu',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Menu.vue'),
      },

      // == EVENTS ==
      {
        path: '/events',
        name: 'Events',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Events.vue'),
      },
      {
        path: '/events-calendar',
        name: 'EventsCalendar',
        component: () => import(/* webpackChunkName: "main" */ '@/views/EventsCalendar.vue'),
      },
      {
        path: '/events/create',
        name: 'EventCreate',
        component: () => import(/* webpackChunkName: "main" */ '@/views/EventEdit.vue'),
      },
      {
        path: '/events/:id',
        name: 'EventInformation',
        props: true,
        component: () => import(/* webpackChunkName: "main" */ '@/views/EventInformation.vue'),
      },
      {
        path: '/events/:id/edit',
        name: 'EventEdit',
        props: true,
        component: () => import(/* webpackChunkName: "main" */ '@/views/EventEdit.vue'),
      },

      // == TAGS ==
      {
        path: '/tags',
        name: 'Tags',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Tags.vue'),
      },
      {
        path: '/tags/create',
        name: 'TagCreate',
        component: () => import(/* webpackChunkName: "main" */ '@/views/TagEdit.vue'),
      },
      {
        path: '/tags/:id',
        name: 'TagInformation',
        props: true,
        component: () => import(/* webpackChunkName: "main" */ '@/views/TagInformation.vue'),
      },
      {
        path: '/tags/:id/edit',
        name: 'TagsEdit',
        props: true,
        component: () => import(/* webpackChunkName: "main" */ '@/views/TagEdit.vue'),
      },

      {
        path: '*',
        beforeEnter: (to, from, next) => {
          const isAuthenticated = store.getters['auth/isUserAuthenticated'];
          if (isAuthenticated) next({ name: 'Menu' });
          else next({ name: 'Login' });
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isUserAuthenticated'];
  if (to.name === 'Login' && isAuthenticated) next({ name: 'Menu' });
  else if (to.name === 'RecoverPassword' && isAuthenticated) next({ name: 'Menu' });
  else if (to.name === 'RecoverPassword' && !isAuthenticated) next();
  else if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
  else next();
});

export default router;
