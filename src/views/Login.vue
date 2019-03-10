<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'Login',
  validations: {
    userName: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(20),
    },
  },
  data() {
    return {
      userName: '',
    };
  },
  computed: {
    userNameErrors() {
      const errors = [];
      if (!this.$v.userName.$dirty) return errors;
      !this.$v.userName.minLength && errors.push('最少3個字');
      !this.$v.userName.maxLength && errors.push('最多20個字');
      !this.$v.userName.required && errors.push('請輸入名子');

      return errors;
    },
  },
  methods: {
    loginUser() {
      this.$v.userName.$touch();
      if (this.$v.userName.$invalid) return false;

      this.$store.commit('SET_USER', { user: this.userName });
      this.$router.push({ name: 'RoomList' });
    },
  },
};
</script>

<template>
  <div class="Register">
    <h1>Register</h1>
    <div class="inputBar mt-5">
      <div class="form-group row" style="text-align: left">
        <label for="username" class="col-sm-2 col-form-label">Username</label>
        <div class="col-sm-10">
          <input
            class="form-control"
            :class="[$v.userName.$dirty && $v.userName.$error?'is-invalid':'']"
            type="text"
            name="username"
            @blur="$v.userName.$touch()"
            placeholder="username"
            v-model.trim="userName"
          >
          <span class="small text-danger" v-for="error in userNameErrors" :key="error">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <em>{{error}}</em>
          </span>
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="loginUser">login</button>
    </div>
  </div>
</template>
