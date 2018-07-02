<template>
  <div ref="wrapper">
    <div>
      <slot />
    </div>
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
    data: {
      // data变化需要刷新滚动条
      type: Array,
      default: null
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
        probeType: this.probeType
      })
    },
    refresh() {
      this.scroll && this.scroll.refresh()
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
