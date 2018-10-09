<template>
  <scroll-view
    ref="scrollView"
    @scroll="scroll"
    :probeType="3"
    :listenScroll="listenScroll"
    :data="listData"
    class="list-view"
  >
    <ul>
      <li class="list-group"
        v-for="(item, index) in listData"
        :key="index"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ item.title }}</h2>
        <ul>
          <li
            @click="selectItem(singer)"
            class="list-group-item"
            v-for="(singer, sindex) in item.items"
            :key="sindex"
          >
            <img class="avatar" v-lazy="singer.avatar" />
            <span class="name">{{ singer.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    ><!--因为是可触摸的，所以要监听touchstart-->
      <ul>
        <li class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="fixed-gruop-title" v-show="fixedTitle" ref="fixed">
      {{ fixedTitle }}
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
import scrollView from '@/base/scrollView/scrollView'
import { attr } from '@/common/js/dom'
const ANCHOR_HEIGHT = 18 // 锚点高度
const TITLE_HEIGHT = 30
export default {
  props: {
    listData: {
      type: Array
    }
  },
  data() {
    return {
      listHeight: [], // 每个滚动区域距离窗口顶部的距离
      scrollY: 0, // 滚动条滚动的距离
      currentIndex: 0,
      diff: -1 // 区域的上限与scrollY的差值
    }
  },
  created() {
    this.listenScroll = true
    this.touches = {}
  },
  computed: {
    shortcutList() {
      return this.listData.map((currentVal, index, arr) => {
        return currentVal.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.listData[this.currentIndex] ? this.listData[this.currentIndex].title : ''
    }
  },
  watch: {
    'listData'(val) {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    'scrollY'(newVal) {
      // 中间滚动
      const listHeight = this.listHeight
      let height = 0
      let nextHeight = 0
      for (let i = 0; i < listHeight.length - 1; i++) {
        height = listHeight[i]
        nextHeight = listHeight[i + 1]
        if ((-newVal >= height && -newVal < nextHeight)) {
          this.diff = nextHeight + newVal
          this.currentIndex = i
          return
        }
      }
    },
    'diff'(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 判断满足就不用修改dom，主要用来减少改变dom的操作
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${this.fixedTop}px, 0)`
    }
  },
  methods: {
    scroll(pos) {
      this.$nextTick(() => {
        this.scrollY = Math.ceil(pos.y)
      })
    },
    onShortcutTouchStart(e) {
      // 手指点击
      let anchorIndex = attr(e.target, 'index')
      this.touches.y1 = e.touches[0].pageY
      this.touches.index = parseInt(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // 手指移动
      this.touches.y2 = e.touches[0].pageY
      let distance = this.touches.y2 - this.touches.y1
      let moveIndex = Math.floor(distance / ANCHOR_HEIGHT) // 也可以这样写distance / 18 | 0
      this._scrollTo(this.touches.index + moveIndex)
    },
    selectItem(singer) {
      this.$emit('selectSinger', singer)
    },
    _calculateHeight() {
      let height = 0
      this.listHeight.push(height)
      this.$refs.listGroup.forEach((item, index) => {
        height += item.offsetHeight
        this.listHeight.push(height)
      })
    },
    _scrollTo(index) {
      // 点击边缘的时候防止index变null
      if (!index && index !== 0) {
        return
      }
      // 滑动到边缘的时候防止index超出边缘
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.scrollView.scrollToElement(this.$refs.listGroup[index])
    }
  },
  components: {
    scrollView
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .list-view
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background-d
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size 12px
        color $color-text-d
        background $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size 14px
    .list-shortcut
      width 20px
      padding 20px 0
      border-radius 10px
      position absolute
      right 0
      top 50%
      transform translate3d(0, -50%, 0)
      background-color $color-background-d
      text-align center
      z-index 1
      .item
        padding 3px
        font-size $font-size-small
        color $color-text-d
        &.current
          color $color-theme
    .fixed-gruop-title
      position absolute
      left 0px
      top 0px
      right 0px
      height 30px
      line-height 30px
      padding-left 20px
      font-size 12px
      color $color-text-d
      background $color-highlight-background
</style>
