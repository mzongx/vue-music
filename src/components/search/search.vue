<template>
  <div class="search">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll-view ref="scroll" class="shortcut" :data="shotcut">
        <div>
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
              <span class="clear" @click="clearSearchAllBtn">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list 
              :searchs="searchHistory"
              @deleteOne="deleteSearchOne"
              @searchHistoryClick="setQuery"
            >
            </search-list>
          </div>
        </div>
      </scroll-view>
    </div>
    <confirm ref="confirm" text="确定要删除所有记录吗？" @okBtn="okBtnCallBack" okBtnText="清除"></confirm>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" @select="setSearchHistory" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import { getHotkey } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
import suggest from '@/components/suggest/suggest'
import { 
  playListMixin,
  searchesMixin
} from '@/common/js/mixins'
import { mapActions } from 'vuex'
import SearchList from '@/base/search-list/search-list'
import confirm from '@/base/confirm/confirm'
import scrollView from '@/base/scrollView/scrollView'
export default {
  mixins: [playListMixin, searchesMixin],
  data() {
    return {
      hotkey: []
    }
  },
  created() {
    this._getHotkey()
  },
  computed: {
    shotcut() {
      return this.searchHistory.concat(this.hotkey)
    }
  },
  watch: {
    query(newVal) {
      // 因为query没有的时候，shortcutWrapper是隐藏的,当前dom是suggest组件，所以要手动刷新
      if (!newVal) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.suggest.refresh()
      this.$refs.scroll.refresh()
    },
    _getHotkey() {
      getHotkey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.splice(0, 10)
        }
      })
    },
    onQueryChange(query) {
      this.query = query
    },
    clearSearchAllBtn() {
      this.$refs.confirm.show()
    },
    okBtnCallBack() {
      this.clearSearchAll()
    },
    ...mapActions([
      'deleteSearchOne',
      'clearSearchAll'
    ])
  },
  components: {
    SearchBox,
    suggest,
    SearchList,
    confirm,
    scrollView
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
