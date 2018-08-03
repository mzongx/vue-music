<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .singer-detail
    position fixed
    left 0px
    top 0px
    right 0px
    bottom 0px
    z-index 100
    background $color-background
  .slide-enter-active,.slide-leave-active
    transition transform .3s ease
  .slide-enter,.slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
