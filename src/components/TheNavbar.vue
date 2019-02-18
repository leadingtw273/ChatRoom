<script>
export default {
    name: 'TheNavbar',
    computed: {
        userName() {
            return this.$store.state.user;
        },
    },
    methods: {
        changeUser() {
            this.$router.push({
                name: 'Login',
            });
        },
    },
};
</script>
<template>
  <div class="the-navbar d-flex justify-content-center">
    <!-- As a heading -->
    <nav class="navbar navbar-light bg-light justify-content-between">
      <span class="navbar-brand mb-0 h1">Chat Room</span>
      <button
        class="btn btn-outline-warning"
        v-on:click="changeUser"
        v-if="userName !== ''"
      >{{userName}}</button>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.the-navbar {
    nav {
        max-width: 800px;
        width: 100%;
        > p {
            margin: 0;
            padding: 0;
        }
    }
}
</style>

