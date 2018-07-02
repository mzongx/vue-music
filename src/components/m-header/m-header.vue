<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
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

<style scoped lang="stylus" rel="stylesheet/stylus">
  // 路径前面加个~是告诉解析器这是一个模块不是一个相对路径，也可以这样写"../../common/stylus/variable"
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .m-header
    position relative
    height: 44px
    text-align: center
    color: $color-theme
    background-color $color-background
    z-index 1
    font-size: 0
    .icon
      display inline-block
      vertical-align middle
      width 30px
      height 32px
      margin-right 9px
      bg-image('logo')
      background-size 100% 100%
    .text
      display inline-block
      vertical-align middle
      line-height 44px
      font-size $font-size-large
</style>
