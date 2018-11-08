<template>
  <ul class="switches">
    <li 
      v-for="(item, index) in switches" 
      :key="index" 
      class="switch-item" 
      :class="activeClass(index)" 
      @click="toggleSwitch(index)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: () => {
        return [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toggleSwitch(index) {
      this.$emit('switchesItem', index)
    },
    activeClass(index) {
      return index === this.currentIndex ? 'active' : ''
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
