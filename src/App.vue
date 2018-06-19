<template>
  <div id="app">
    <m-header />
    <Tab />
    <router-view/>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header'
import Tab from '@/components/tab/tab'
export default {
  name: 'App',
  data() {
    return {

    }
  },
  components: {
    MHeader,
    Tab
  }
}
</script>

<style>
</style>
