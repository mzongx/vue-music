<template>
  <div class="song-list">
    <ul>
      <li class="item" 
        @click="selectPlay(song, index)" 
        v-for="(song, index) in songs" 
        :key="index"
      >
        <div v-if="rank" class="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: function() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    
  },
  data() {
    return {
      
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`
    },
    selectPlay(item, index) {
      this.$emit('select', item, index)
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index
      }
      return ''
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .song-list
    .item
      display flex
      align-items center
      height 64px
      box-sizing border-box
      font-size $font-size-medium
      .content
        line-height 20px
        flex 1
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          margin-top 4px
          color $color-text-d
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
