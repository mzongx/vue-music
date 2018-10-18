<template>
  <div ref="wrapper">
    <slot />
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 1
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      // data变化需要刷新滚动条
      type: Array,
      default: null
    },
    pullUp: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: false,
        scrollY: true,
        click: this.click,
        pullUpLoad: this.pullUp,
        probeType: this.probeType
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      
      if (this.pullUp) {
        this.scroll.on('pullingUp', () => {
          console.log('pullingUp')
          this.$emit('onPullingUp')
        })
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    }
  },
  watch: {
    'data'() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
</style>
