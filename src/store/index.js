import vue from 'vue';
import vuex from 'vuex';
import axios from '../plugins/axios.js';
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
        SET_ROOMS(state, { rooms }) {
            state.rooms = rooms;
        },
        SET_ROOM(state, { room }) {
            state.rooms.push(room);
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getKey(state) {
            return state.key;
        },
        getRooms(state) {
            return state.rooms;
        },
    },
    actions: {
        async getRooms({ commit }) {
            try {
                const { data } = await axios.get('/rooms');
                commit('SET_ROOMS', { rooms: data });
            } catch (err) {
                console.log(err);
            }
        },
        async addRoom({ commit }, room) {
            try {
                const { data } = await axios.post('/rooms', room);
                commit('SET_ROOM', { room: data });
            } catch (err) {
                console.log(err);
            }
        },
    },
    plugins: [createPersistedState()],
});
