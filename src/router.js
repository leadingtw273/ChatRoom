import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/Login.vue';
import RoomList from './views/RoomList.vue';
import Room from './views/Room.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/rooms',
      name: 'RoomList',
      component: RoomList,
    },
    {
      path: '/rooms/:id',
      name: 'Room',
      component: Room,
    },
    {
      path: '*',
      component: Login,
    },
  ],
});
