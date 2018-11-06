<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <div class="title">添加歌曲到列表</div>
        <div class="close" @click="hide"><i class="icon-close"></i></div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switchesActive="switchesToggle"></switches>
        <div class="list-wrapper" v-if="switchesActive === 0">
          <scroll-view ref="scroll" :data="playRecent" class="list-scroll">
            <div class="list-inner">
              <song-list @select="selectItem" :songs="playRecent" ></song-list>
            </div>
          </scroll-view>
        </div>
        <div class="list-wrapper" v-if="switchesActive === 1">
          <scroll-view ref="scroll" :data="searchHistory" class="list-scroll">
            <div class="list-inner">
              <search-list
                :searchs="searchHistory"
                @deleteOne="deleteSearchOne"
                @searchHistoryClick="setQuery"
              >
              </search-list>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="search-result" ref="searchResult" v-show="query">
        <suggest @select="setSearchHistory" :showSinger="showSinger" ref="suggest" :query="query"></suggest>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import Switches from '@/base/switches/switches'
import Suggest from '@/components/suggest/suggest'
import SearchList from '@/base/search-list/search-list'
import ScrollView from '@/base/scrollView/scrollView'
import SongList from '@/base/song-list/song-list'
import { mapActions, mapGetters } from 'vuex'
import { searchesMixin } from '@/common/js/mixins'
export default {
  mixins: [searchesMixin],
  data() {
    return {
      showFlag: false,
      switchesActive: 0,
      showSinger: false
    }
  },
  computed: {
    ...mapGetters([
      'playRecent'
    ])
  },
  watch: {
    query(newVal) {
      // 因为query没有的时候，shortcutWrapper是隐藏的,当前dom是suggest组件，所以要手动刷新
      if (!newVal) {
        setTimeout(() => {
          this.$refs.suggest.refresh()
        }, 20)
      }
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    onQueryChange(query) {
      this.query = query
    },
    switchesToggle(index) {
      this.switchesActive = index
    },
    selectItem(song, index) {
      console.log(song)
      this.insertSong({
        song: song
      })
      this.savePlayRecent(song)
    },
    ...mapActions([
      'deleteSearchOne',
      'insertSong',
      'savePlayRecent'
    ])
  },
  components: {
    SearchBox,
    Switches,
    Suggest,
    SearchList,
    ScrollView,
    SongList
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active,&.slide-leave-active
      transition all .3s
    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
