<script>
export default {
  name: 'TheNavbar',
};
</script>
<template>
  <div class="the-navbar d-flex justify-content-center">
    <!-- As a heading -->
    <nav class="navbar navbar-light bg-light justify-content-between">
      <span class="navbar-brand mb-0 h1" @click="$_toPage('Login')">Chat Room</span>
      <div>
        <button
          class="btn btn-outline-primary mr-3"
          @click="$_toPage('RoomList')"
          v-if="$_routeName == 'Room'"
        >Room List</button>
        <button
          class="btn btn-outline-warning"
          @click="$_toPage('Login')"
          v-if="$_userName !== ''"
        >{{$_userName}}</button>
      </div>
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

    > .navbar-brand {
      cursor: pointer;
    }
  }
}
</style>

