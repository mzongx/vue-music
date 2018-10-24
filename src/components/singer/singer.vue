<template>
  <div class="singer" ref="singer">
    <div class="loading-container" v-show="!singerList.length">
      <loading />
    </div>
    <list-view ref="listView" :list-data="singerList" @selectSinger="chooseSinger"></list-view>
    <router-view />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'
import { getSingerList } from 'common/api/singer'
import { ERR_OK } from 'common/api/config'
import Singer from 'common/js/singer'
import listView from '@/base/listView/listView'
import loading from '@/base/loading/loading'
import { playListMixin } from '@/common/js/mixins'
const HOT_NAME = '热门'
const HOT_LIST_LEN = 10
export default {
  mixins: [playListMixin],
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(playList) {
      // 底部mini-player自适应
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listView.refresh()
    },
    chooseSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singerList = this._normalSingerList(res.data.list)
        }
      })
    },
    _normalSingerList(list) {
      // 格式化singerList成目标格式
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_LIST_LEN) {
          // 因为歌手经常用到，所以抽出单独一个类Singer
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        let key = item.Findex
        // 没有key才添加，有的话就跳过
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid, 
          name: item.Fsinger_name
        }))
      })
      // object是无序的，所以需要把数据转为有序的array
      let arrHot = []
      let arr = []
      for (let key in map) {
        let val = map[key]
        if (/[a-zA-Z]/.test(val.title)) {
          arr.push(val)
        } else if (val.title === HOT_NAME) {
          arrHot.push(val)
        }
      }
      arr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return arrHot.concat(arr)
    },
    ...mapMutations({
      // mutations是唯一改变state的操作，这里获取到歌手信息。
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    listView,
    loading
  }
}
</script>

<style scoped lang="stylus">
  .singer
    width 100%
    position fixed
    bottom 0px
    top 88px
    z-index 1
</style>
