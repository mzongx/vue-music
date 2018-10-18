<template>
  <scroll-view ref="scroll" :data="searchList" :pullUp="pullUp" @onPullingUp="pullingUp" class="suggest">
    <ul class="suggest-list">
      <li v-for="(item, index) in searchList" :key="index" class="suggest-item">
        <div class="icon">
          <i :class="getClsIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getTextName(item)"></p>
        </div>
      </li>
      <!-- <loading v-show="!searchList.length"></loading> -->
    </ul>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
import { search } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
import { createSong } from '@/common/js/song'
import loading from '@/base/loading/loading'
import scrollView from '@/base/scrollView/scrollView'
const setSinger = 'singer'
export default {
  props: {
    showSinger: {
      type: Boolean,
      default: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1,
      pullUp: true,
      searchList: []
    }
  },
  created() {
    
  },
  watch: {
    query(newVal) {
      this.searchList = []
      this._search()
    }
  },
  methods: {
    _search() {
      if (!this.query) {
        return
      }
      search(this.query, this.showSinger, this.page).then((res) => {
        if (res.code === ERR_OK) {
          this.searchList = this._getSearchList(res.data)
        }
      })
    },
    _getSearchList(data) {
      // 搜索结果有两部分组成，一是歌曲，二是歌手
      let ret = []
      if (data.zhida && (data.zhida.albummid || data.zhida.singerid)) {
        ret.push({...data.zhida, ...{type: setSinger}})
      }

      if (data.song) {
        ret = ret.concat(this._normalizeSong(data.song.list))
      }
      
      return ret
    },
    getClsIcon(item) {
      if (item.type === setSinger) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getTextName(item) {
      if (item.type === setSinger) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _normalizeSong(item) {
      // 格式化歌曲
      let ret = []
      item.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    pullingUp(res) {
      console.log('res')
      this.$refs.scroll.finishPullUp()
    }
  },
  components: {
    loading,
    scrollView
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
          flex: 0 0 30px
          width: 30px
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
