<template>
  <div class="song-list">
    <ul>
      <li class="item" @click="selectPlay(song, index)" v-for="(song, index) in songs" :key="index">
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
    }
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
</style>
