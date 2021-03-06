<template>
  <div class="recommend-wrapper" ref="recommendWrapper">
    <scroll-view ref="scroll" class="recommend-content" :data="descList">
      <div>
        <div class="recommend-slide">
          <div class="slide-content" v-if="recommend.length">
            <Slider ref="slider">
              <div v-for="(slideItem, index) in recommend" :key="index">
                <a :href="slideItem.linkUrl">
                  <img @load="loadImg" :src="slideItem.picUrl" />
                </a>
              </div>
            </Slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1>热门歌单推荐</h1>
          <div class="loading-container" v-show="!descList.length">
            <loading />
          </div>
          <ul>
            <li 
              v-for="(item, index) in descList" 
              :key="index" 
              class="item"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
    <router-view />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'
import { getRecommend, getDescList } from '@/common/api/recommend'
import { ERR_OK } from '@/common/api/config'
import Slider from '@/base/slider/slider'
import scrollView from '@/base/scrollView/scrollView'
import loading from '@/base/loading/loading'
import { playListMixin } from '@/common/js/mixins'
export default {
  mixins: [playListMixin],
  data() {
    return {
      recommend: [],
      descList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDescList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommendWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })

      this.setDisc(item)
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (ERR_OK === res.code) {
          this.recommend = res.data.slider
        }
      })
    },
    _getDescList() {
      getDescList().then((res) => {
        if (ERR_OK === res.code) {
          this.descList = res.data.list
          this.showLoading = false
        }
      })
    },
    loadImg() {
      // 优化旧版本的better-scroll,
      if (!this.checkLoadImg) {
        this.$refs.slider.refresh()
        this.checkLoadImg = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    scrollView,
    loading
  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .recommend-wrapper
    width 100%
    position fixed
    bottom 0px
    top 88px
    .recommend-content
      height 100%
      overflow hidden
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
        height 65px
        line-height 65px
        text-align center
        color $color-theme
        font-size $font-size-medium
      .item
        display flex
        align-items center
        padding 0 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          font-size 0
          margin-right 20px
          img
            width 100%
            height 100%
        .text
          flex 1
          font-size $font-size-medium
          line-height 20px
          .name
            margin-bottom 10px
            color $color-text
          .desc
            color $color-text-d
</style>
