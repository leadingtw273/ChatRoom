<template>
  <div id="app">
    <the-navbar/>
    <div class="container">
      <router-view style="margin:20px 0px 40px 0px"/>
    </div>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue';

export default {
    name: 'App',
    components: {
        TheNavbar,
    },
    data() {
        return {
            //
        };
    },
};
</script>
<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
}
</style>

