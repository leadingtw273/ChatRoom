import vue from 'vue';
import vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

vue.use(vuex);

export default new vuex.Store({
    strict: true,
    state: {
        rooms: [],
        user: null,
        key: null,
    },
    mutations: {
        SET_USER(state, { user }) {
            state.user = user;
        },
        SET_PRIVATE_KEY(state, { key }) {
            state.key = key;
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getKey(state) {
            return state.key;
        },
    },
    plugins: [createPersistedState()],
});
