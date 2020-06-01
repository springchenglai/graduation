<template>
  <div id="app">
    <router-view v-if="isShowRouterView" />
    <LoadModal v-if="loading" ref="loading"></LoadModal>
    <!-- 因为在各个页面都能播放，所以播放器设置成全局的 -->
    <div class="audio" v-if="songPlaying.id">
      <audio
        v-if="isShowAudio"
        :src="songUrl"
        ref="audio"
        @loadeddata = "autoPlay"
        @timeupdate = "playProgress"
        @ended = "playEnd"
        @error = "playError"
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loading: false,
      isPlay: false,
      progress: 0,
      isloadData: false,
      isShowRouterView: true
    };
  },
  provide(){
    return {
      app: this
    }
  },
  watch: {
    // isloadData(val){
    //   val && this.playPause()
    // }
  },
  computed: {
    songPlaying(){
      return this.$common.getters.getPlayingSong
    },
    songUrl(){
      return 'https://music.163.com/song/media/outer/url?id=' + this.songPlaying.id + '.mp3'
    },
    isShowAudio(){
      if(this.$route.name == 'login'){
        return false
      }
      return true
    }
  },
  // APP只会被实例化一次，即created钩子只执行一次
  created() {
    const scope = this;
    const vuePrototype = Reflect.getPrototypeOf(Reflect.getPrototypeOf(this));
    // 给vue根实例的原型增加属性
    vuePrototype.$loading = {
      show() {
        scope.loading = true;
      },
      hide() {
        scope.loading = false;
      }
    };
    vuePrototype.$reload = () => {
      this.isShowRouterView = false
      // 确保路由区域销毁之后再重建
      this.$nextTick(() => {
        this.isShowRouterView = true
      })
    }
    this.$router.beforeEach((from, to, next) => {
      vuePrototype.$loading.hide();
      next();
    });
  },
  methods: {
    autoPlay() {
      this.isloadData = true
      this.playPause()
      // 不要自动播放了
      /* try {
        this.$refs.audio.play();
      } catch(e) {
        // 不能这样捕获错误
        this.$toast('受浏览器限制，不能自动播放音频')
      }
      !this.$refs.audio.paused && (this.isPlay = true) */
    },
    playPause(type) {
      if(!this.isloadData){
        this.$toast('音频数据加载出错');
      }
      if(type === 'play' && this.isloadData) {
        this.$refs.audio.play();
        this.isPlay = true;
        return
      }
      if (this.$refs.audio.paused && this.isloadData) {
        this.$refs.audio.play();
        this.isPlay = true;
      } else {
        this.$refs.audio.pause();
        this.isPlay = false;
      }
    },
    playError() {
      this.$toast('音频数据加载出错,权限或者网络问题');
      this.isPlay = false
      this.isloadData = false
    },
    playProgress() {
      const audio = this.$refs.audio;
      if(!audio){
        return
      }
      if (audio.currentTime === 0 || !audio.duration) {
        this.progress = 0;
      } else {
        this.progress = Math.ceil(audio.currentTime / audio.duration * 100);
      }
    },
    playEnd(){
      // 播放完之后到下一首
      const playlistSongs = this.$common.getters.getPlaylist
      let nextSong
      if(playlistSongs <= 1){
        nextSong = this.songPlaying
      } else {
        let toIndex
        playlistSongs.forEach((item,index) => {
          if(item.id === this.songPlaying.id){
            toIndex = (index === playlistSongs.length - 1) ? 0 : (index+1)
          }
        });
        nextSong = playlistSongs[toIndex]
      }
      this.$common.commit('changePlayingSong',nextSong)
    }
  }
};
</script>
<style lang="scss">
  @import './styles/initial';
</style>
