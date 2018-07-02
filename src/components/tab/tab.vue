<template>
  <div class="tab">
    <router-link class="tab-item" tag="div" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/rank">
      <span class="tab-link">排名</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
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

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .tab
    position relative
    display flex
    height 44px
    line-height 44px
    font-size 14px
    background-color $color-background
    z-index 1
    .tab-item
      flex 1
      text-align center
      &.router-link-active
        .tab-link
          color $color-theme
          border-bottom 2px solid $color-theme
      .tab-link
        padding-bottom 5px
        color $color-text-l
</style>
