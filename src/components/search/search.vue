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
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list 
            :searchs="searchHistory"
            @deleteOne="deleteOne"
          >
          </search-list>
        </div>
      </div>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import { getHotkey } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
import { trim } from '@/common/js/util'
import suggest from '@/components/suggest/suggest'
import { playListMixin } from '@/common/js/mixins'
import { mapGetters } from 'vuex'
import SearchList from '@/base/search-list/search-list'
export default {
  mixins: [playListMixin],
  data() {
    return {
      hotkey: [],
      query: ''
    }
  },
  created() {
    this._getHotkey()
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
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
    },
    deleteOne(item) {
      console.log(item)
    }
  },
  components: {
    SearchBox,
    suggest,
    SearchList
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
