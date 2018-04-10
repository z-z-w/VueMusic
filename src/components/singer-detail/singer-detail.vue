<template>
    <transition name="slider">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>

</template>

<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from "api/singer";
    import {ERR_OK} from "../../api/config";
    import {createSong} from "../../common/js/song";
    import {getMusic} from "../../api/singer";
    import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([   //mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
        'singer'
      ])
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;   //获取item中的musicData属性
          if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped type="text/stylus" lang="stylus">
    @import "~common/stylus/variable"

    .slider-enter-active, .slider-leave-active
        transition all 0.3s
    .slider-enter, .slider-leave-to
        transform translate3d(100%, 0, 0)


    .singer-detail
        position: fixed;
        z-index 100
        top 0
        left: 0
        right: 0
        bottom: 0
        background $color-background
</style>