<script>
import _ from 'lodash';
import HENMAP from '../plugins/HENMAP.js';

const chaos = new HENMAP(0.00001, [-0.0001, 0.0001]);

export default {
  name: 'Login',
  sockets: {
    chaos_next_um({ _x, _step, _isSync }) {
      this.isSync = _isSync;
      if (!this.isSync) {
        this.chaosValue.step = _step + 1;
        this.chaosValue.x = chaos.runChaos(this.chaosValue.step, _x);
        this.chaosValue.um = chaos.createUm(this.chaosValue.x);

        this.$socket.emit('chaos_um', _.cloneDeep(this.chaosValue));
      }
    },
  },
  data() {
    return {
      userName: '',
      isSync: false,
      chaosValue: {
        step: 100,
        x: [],
        um: 0,
      },
    };
  },
  watch: {
    isSync(val) {
      if (this.userName !== '' && val) {
        const key = this.chaosValue.x
          .map(val => val.toString().slice(0, val.toString().indexOf('.') + 5))
          .join('/');
        this.$store.commit('SET_USER', { user: this.userName });
        this.$store.commit('SET_PRIVATE_KEY', { key });
        this.$router.push({ name: 'RoomList' });
      }
    },
  },
  methods: {
    loginUser() {
      const CHAOS_INIT_VALUE = chaos.getRandomInitValue();

      const step = 100;
      const x = chaos.chaosInit(CHAOS_INIT_VALUE, step);
      const um = chaos.createUm(x);

      this.chaosValue = { x, step, um };
      this.$socket.emit('chaos_ready', this.chaosValue);
    },
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
            v-model="userName"
          >
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="loginUser">login</button>
    </div>
  </div>
</template>
