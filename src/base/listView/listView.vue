<template>
  <scroll-view ref="scrollView" @scroll="scroll" :probeType="3" :listenScroll="true" :data="listData" class="list-view">
    <ul>
      <li class="list-group" v-for="(item, index) in listData" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{ item.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="(singer, sindex) in item.items" :key="sindex">
            <img class="avatar" v-lazy="singer.avatar" />
            <span class="name">{{ singer.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"><!--因为是可触摸的，所以要监听touchstart-->
      <ul>
        <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current': currentIndex === index}">{{ item }}</li>
      </ul>
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
import scrollView from '@/base/scrollView/scrollView'
import { attr } from '@/common/js/dom'
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
      currentIndex: 0
    }
  },
  computed: {
    shortcutList() {
      return this.listData.map((currentVal, index, arr) => {
        return currentVal.title.substr(0, 1)
      })
    }
  },
  watch: {
    'listData'(val) {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    'scrollY'(newVal) {
      // newVal > 0滚动条到达顶部
      if (newVal > 0) {
        this.currentIndex = 0
      }
      // 中间滚动
      const listHeight = this.listHeight
      let height = 0
      let nextHeight = 0
      for (let i = 0; i < listHeight.length - 1; i++) {
        height = listHeight[i]
        nextHeight = listHeight[i + 1]
        if ((-newVal >= height && -newVal < nextHeight)) {
          this.currentIndex = i
          return
        }
      }
    }
  },
  methods: {
    _calculateHeight() {
      let height = 0
      this.listHeight.push(height)
      this.$refs.listGroup.forEach((item, index) => {
        height += item.offsetHeight
        this.listHeight.push(height)
      })
    },
    scroll(pos) {
      this.$nextTick(() => {
        this.scrollY = Math.ceil(pos.y)
      })
    },
    onShortcutTouchStart(e) {
      let anchorIndex = attr(e.target, 'index')
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      console.log(e)
    },
    _scrollTo(index) {
      this.$refs.scrollView.scrollToElement(this.$refs.listGroup[index], 1000)
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
      .item
        padding 3px
        font-size $font-size-small
        color $color-text-d
        &.current
          color $color-theme
</style>
