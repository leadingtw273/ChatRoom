import Vue from 'vue';
import './plugins/axios';
import 'bootstrap';
import './assets//style/all.scss';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuelidate from 'vuelidate';

Vue.config.productionTip = false;
Vue.use(Vuelidate);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
