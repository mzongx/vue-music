<template>
  <div class="singer">
    <div class="loading-container" v-show="!singerList.length">
      <loading />
    </div>
    <list-view :list-data="singerList"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'common/api/singer'
import { ERR_OK } from 'common/api/config'
import listView from '@/base/listView/listView'
import loading from '@/base/loading/loading'
const HOT_NAME = '热门'
const HOT_LIST_LEN = 10
export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singerList = this._normalSingerList(res.data.list)
        }
      })
    },
    _singer(id, name) {
      let obj = {
        id: id,
        name: name,
        avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
      }
      return obj
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
          map.hot.items.push(this._singer(item.Fsinger_mid, item.Fsinger_name))
        }
        let key = item.Findex
        // 没有key才添加，有的话就跳过
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(this._singer(item.Fsinger_mid, item.Fsinger_name))
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
    }
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
</style>
