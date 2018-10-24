<template>
  <scroll-view 
    ref="scroll" 
    :data="searchList" 
    :pullUp="pullUp" 
    @onPullingUp="pullingUp" 
    class="suggest"
  >
    <ul class="suggest-list">
      <li 
        v-for="(item, index) in searchList" 
        :key="index" 
        class="suggest-item"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getClsIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getTextName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
import { search } from '@/common/api/search'
import { ERR_OK } from '@/common/api/config'
import { createSong } from '@/common/js/song'
import loading from '@/base/loading/loading'
import scrollView from '@/base/scrollView/scrollView'
import { mapMutations } from 'vuex'
import Singer from '@/common/js/singer'
const TYPE_SINGER = 'singer'
const PERPAGE = 20
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
      searchList: [],
      hasMore: true
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
    refresh() {
      this.$refs.scroll.refresh()
    },
    _search() {
      this.hasMore = true
      this.page = 1
      search(this.query, this.showSinger, this.page, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.searchList = this._getSearchList(res.data)
          this._checkMore(res.data)
        }
      })
    },
    _getSearchList(data) {
      // 搜索结果有两部分组成，一是歌曲，二是歌手
      let ret = []

      if (data.zhida && data.zhida.singerid) {
        // 判断searchList有无歌手
        let fsSingerIndex = this.searchList.findIndex((value, index, arr) => {
          return value.singerid === data.zhida.singerid
        })

        // 如果searchList有歌手信息存在，就不添加(主要防止上拉加载更多重复加载歌手)
        if (fsSingerIndex === -1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
      }

      if (data.song) {
        ret = ret.concat(this._normalizeSong(data.song.list))
      }
      
      return ret
    },
    getClsIcon(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getTextName(item) {
      if (item.type === TYPE_SINGER) {
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
    _checkMore(data) {
      // 检查是否还有更多
      let song = data.song
      if (!song.list.length || (song.curnum * song.curpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/search/${item.singermid}`
        })
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })

        this.setSinger(singer)
      }
    },
    pullingUp(res) {
      // 下拉刷新
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.showSinger, this.page, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.searchList = this.searchList.concat(this._getSearchList(res.data))
          this._checkMore(res.data)
          this.$refs.scroll.finishPullUp()
        }
      })
    },
    ...mapMutations({
      // mutations是唯一改变state的操作，这里获取到歌手信息。
      setSinger: 'SET_SINGER'
    })
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
