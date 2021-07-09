<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home'
export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Home
  }
}
</script>

<style>
#app {
  width: 1000px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}
</style>
