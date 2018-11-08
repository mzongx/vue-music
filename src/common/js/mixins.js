import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle, trim } from '@/common/js/util'

// mixin小播放器引起高度变化，刷新滚动条
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

// 播放模式mixin
export const playMixin = {
  methods: {
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequanceList)
      } else {
        list = this.sequanceList
      }
      // 如果直接更改playList的话，那currentSongIndex也会改，就切歌了，解决办法就是保持打乱的index==当前的currentIndex
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  computed: {
    playModeIcon() {
      return this.mode === playMode.sequance ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'playList',
      'sequanceList',
      'mode',
      'currentSong'
    ])
  }
}

// 搜索mixins
export const searchesMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    setQuery(query) {
      this.$refs.searchBox.setQuery(this.hotName(query))
    },
    hotName(text) {
      return trim(text)
    },
    setSearchHistory() {
      this.saveSearchHistory({
        query: this.query
      })
    },
    ...mapActions([
      'saveSearchHistory'
    ])
  }
}
