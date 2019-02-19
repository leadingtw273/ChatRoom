import vue from 'vue';
import vuex from 'vuex';
import io from 'socket.io-client';
import socketRoom from './plugins/Socket_Rooms';
import createPersistedState from 'vuex-persistedstate';

const socket = io('http://localhost:3000/', {
    autoConnect: false,
    path: '/rooms',
});

vue.use(vuex);

export default new vuex.Store({
    strict: true,
    state: {
        user: null,
        chatrooms: [],
    },
    actions: {},
    mutations: {
        loginUser(state, { user }) {
            state.user = user;
        },
        newMessage(state, payload) {
            const target = state.history.find(msg => msg.id === payload.roomid)
                .messages;
            const data = {
                id: target.length,
                message: payload.message,
                user: payload.user,
            };
            target.push(data);
        },
        pullRooms(state, payload) {
            payload.forEach(element => {
                element.messages = [];
            });
            state.chatrooms = payload;
        },
        newRoom(state, payload) {
            state.chatrooms.push(payload);
        },
        openRoomSocket() {},
        closeRoomSocket() {},
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getRooms(state) {
            return state.chatrooms;
        },
    },
    plugins: [socketRoom(socket), createPersistedState()],
});
