import vue from 'vue';
import vuex from 'vuex';
import axios from '../plugins/axios.js';
import createPersistedState from 'vuex-persistedstate';

vue.use(vuex);

export default new vuex.Store({
    strict: true,
    state: {
        roomList: [],
        user: null,
    },
    mutations: {
        SET_USER(state, { user }) {
            state.user = user;
        },
        SET_ROOM_LIST(state, { roomList }) {
            state.roomList = roomList;
        },
        PUSH_ROOM(state, { room }) {
            state.roomList.push(room);
        },
    },
    getters: {
        userName(state) {
            return state.user;
        },
        roomList(state) {
            return state.roomList;
        },
        roomName(state, getters) {
            return id => {
                return getters.roomList.find(room => room.id === id).roomName;
            };
        },
    },
    actions: {
        async getRoomList({ commit }) {
            try {
                const { data } = await axios.get('/rooms');
                commit('SET_ROOM_LIST', { roomList: data });
            } catch (err) {
                console.log(err);
            }
        },
        async addRoom({ commit }, room) {
            try {
                const { data } = await axios.post('/rooms', room);
                commit('PUSH_ROOM', { room: data });
            } catch (err) {
                console.log(err);
            }
        },
    },
    plugins: [createPersistedState()],
});
