import { mapGetters } from 'vuex'
export const playListMixin = {
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    // 这里也要去刷新一下，因为切换路由缓存会导致better-scroll不能滑动
    this.handlePlayList(this.playList)
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList(playList) {
      // 因为mixin会把这个函数加入到引入的组件，所以目标组件必须要写handlePlayList这个函数来覆盖这个函数，没有定义就会执行mixin的函数
      throw Error('must have handlePlayList function')
    }
  }
}
