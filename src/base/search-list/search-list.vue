<template>
  <div class="search-list">
    <transition-group tag="ul" name="fade">
      <li 
        class="search-item" 
        v-for="item in searchs" 
        :key="item"
        @click="searchHistoryClick(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searchs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  methods: {
    deleteOne(item) {
      this.$emit('deleteOne', item)
    },
    searchHistoryClick(item) {
      this.$emit('searchHistoryClick', item)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search-list
    .search-item
      &.fade-enter-active,&.fade-leave-active
        transition all .1s
      &.fade-enter,&.fade-leave-to
        height 0
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
