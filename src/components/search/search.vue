<template>
  <div class="search">
    <search-box ref="searchBox"></search-box>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li 
              class="item" 
              v-for="(item, index) in hotkey" 
              :key="index"
              @click="setQuery(item.k)">
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import { getHotkey } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
export default {
  data() {
    return {
      hotkey: []
    }
  },
  created() {
    this._getHotkey()
    // this.trim('   ddd d')
  },
  methods: {
    _getHotkey() {
      getHotkey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.splice(0, 10)
        }
      })
    },
    setQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    trim(text) {
      let reg = /^\s|\s$/
      let ret = text.replace(reg, '')
      // console.log(ret)
      // let ret = /^\s|\s$/.replace(text, '')
      // return ret
    }
  },
  components: {
    SearchBox
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  .search
    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-d
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d
</style>
