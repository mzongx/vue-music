<template>
  <div class="singer">
    singer
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'common/api/singer'
import { ERR_OK } from 'common/api/config'
export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singerList = res.data.list
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
  .singer
    width 100%
    position fixed
    bottom 0px
    top 88px
</style>
