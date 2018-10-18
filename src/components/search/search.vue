<template>
  <div class="search">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <div class="shortcut-wrapper">
      <div class="shortcut" v-show="!query">
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
      <div class="search-result" v-show="query">
        <suggest :query="query"></suggest>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import { getHotkey } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
import { trim } from '@/common/js/util'
import suggest from '@/components/suggest/suggest'
export default {
  data() {
    return {
      hotkey: [],
      query: ''
    }
  },
  created() {
    this._getHotkey()
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
      this.$refs.searchBox.setQuery(this.hotName(query))
    },
    hotName(text) {
      return trim(text)
    },
    onQueryChange(query) {
      this.query = query
    }
  },
  components: {
    SearchBox,
    suggest
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
