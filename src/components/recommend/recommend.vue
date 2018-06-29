<template>
  <div class="recommend-wrapper">
    <div class="recommend-content">
      <div class="recommend-slide">
        <div class="slide-content" v-if="recommend.length">
          <Slide>
            <div v-for="(slideItem, index) in recommend" :key="index">
              <a>
                <img :src="slideItem.picUrl" />
              </a>
            </div>
          </Slide>
        </div>
      </div>
      <div class="recommend-list">
        <h1>热门歌单推荐</h1>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend } from '@/common/api/recommend'
import { ERR_OK } from '@/common/api/config'
import Slide from '@/base/slide/slide'
export default {
  data() {
    return {
      recommend: []
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (ERR_OK === 0) {
          this.recommend = res.data.slider
        }
      })
    }
  },
  components: {
    Slide
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .recommend-wrapper
    .recommend-content
      .recommend-slide
        position relative
        width 100%
        height 0
        padding-top 40%
        overflow hidden
        .slide-content
          position absolute
          top 0
          left 0
          width 100%
          height 100%
    .recommend-list
      h1
        text-align center
        color $color-theme
        font-size $font-size-small
</style>
