<template>
  <div class="search-box-wrapper">
    <div class="search-box">
      <i class="icon-search"></i>
      <input :placeholder="placeholder" class="box" v-model="query" />
      <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  created() {
    this.$watch('query', debounce((newVal) => {
      this.$emit('query', newVal)
    }, 200))
  },
  methods: {
    clearQuery() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  .search-box-wrapper
    margin 20px
    .search-box
      display flex
      align-items center
      box-sizing border-box
      width 100%
      padding 0 6px
      height 40px
      background $color-highlight-background
      border-radius 6px
      .icon-search
        font-size 24px
        color $color-background
      .box
        flex 1
        margin 0 5px
        line-height 18px
        background $color-highlight-background
        color $color-text
        font-size 14px
        outline 0
      .icon-dismiss
        font-size $font-size-medium-x
        color $color-background
</style>
