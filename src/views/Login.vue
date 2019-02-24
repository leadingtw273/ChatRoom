<script>
import io from 'socket.io-client';

let socket = {};
export default {
  name: 'Login',
  data() {
    return {
      username: '',
    };
  },
  methods: {
    loginUser() {
      this.$store.commit('loginUser', { user: this.username });
      this.$router.push({
        name: 'RoomList',
      });
    },
    socketTest() {
      const data = {
        name: 'mark',
        message: 'test',
      };

      socket.emit('test', data);
    },
  },
  created() {
    console.log('create');
    try {
      socket = io('http://192.168.0.4:9453/', {
        path: '/chaos',
      });
      socket.on('get', data => {
        console.log(data);
      });
    } catch (e) {
      console.log(e);
    }
  },
  beforeDestroy() {
    socket.close();
  },
};
</script>

<template>
  <div class="Register">
    <h1>Register</h1>
    <div class="inputBar mt-5">
      <div class="form-group row">
        <label for="username" class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm-10">
          <input
            class="form-control"
            type="text"
            name="username"
            placeholder="username"
            v-model="username"
          >
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="loginUser">login</button>
    </div>
    <button type="button" class="btn btn-primary mt-4" @click="socketTest">Socket Test</button>
  </div>
</template>
