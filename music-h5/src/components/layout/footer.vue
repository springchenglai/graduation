<template>
  <div id="footer">
    <ul v-if="!showPlayBar" class="clearfix">
      <li :class="{'flex': true, 'active': activeMenu === item.id}" v-for="(item,index) in menu" v-if="item.id!='avatar'" :key="index" @click="toRouter(item)">
        <span><i :class="['iconfont', item.icon]"></i></span>
        <span>{{item.name}}</span>
      </li>
      <li class="avatar" v-else>
        <img v-if="song.id" :src="song.avatar" :class="{'isRotate': app.isPlay}" alt="" @click="isShowPlayBar">
        <div class="flex click-to-play" v-else @click="playRandom">
          <span><i class="iconfont icon-bofang"></i></span>
          <span>随便听听</span>
        </div>
      </li>
    </ul>
    <ul v-else class="clearfix play-bar">
      <li class="avatar">
        <img :src="song.avatar" :class="{'isRotate': app.isPlay}" alt="" @click="isShowPlayBar">
      </li>
      <li class="songinfo" @click="toPlayPage">
        <p class="song-name">{{song.name}}</p>
        <p class="songers">- {{song.artists.join(',')}}</p>
      </li>
      <li class="play-btn">
        <i :class="{'iconfont': true, 'icon-zanting': app.isPlay, 'icon-bofang': !app.isPlay}" @click="app.playPause"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Footer',
  data() {
    return {
      showPlayBar: false,
      isPlaying: false,
      menu: [
        {
          name: '发现',
          id: 'home',
          icon: 'icon-tubiaozhizuomoban',
          router: 'home'
        },
        {
          name: '动态',
          id: 'dynamic',
          icon: 'icon-swticonyinle1',
          router: 'musicdynamic'
        },
        {
          name: '正在播放',
          id: 'avatar'
        },
        {
          name: '我的音乐',
          id: 'music',
          icon: 'icon-icon-',
          router: 'mymusic'
        },
        {
          name: '我的',
          id: 'person',
          icon: 'icon-yonghu',
          router: 'person'
        }
      ]
    }
  },
  inject: {
    app: 'app'
  },
  computed: {
    song(){
      return this.$common.getters.getPlayingSong
    },
    activeMenu(){
      let path = this.$route.path.split('/')
      return path[path.length-1]
    }
  },
  methods: {
    isShowPlayBar(){
      this.showPlayBar = !this.showPlayBar
    },
    toPlayPage(){
      this.$router.push({
        name: 'play',
        params: { id: this.song.id },
        query: { name: this.song.name }
      })
    },
    toRouter(item){
      this.$router.push({
        name: item.router
      })
    },
    playRandom(){
      this.$common.commit('changePlayingSong',this.$common.state.songRandom)
    }
  }
}
</script>
<style lang="scss">
  #footer {
    height: 56px;
    width: 100%;
    line-height: 48px;
    border-top: 1px solid #ddd;
    // padding: 5px 0;
    background-color: #fff;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    z-index: 1000;
    ul{
      padding: 5px 0;
      height: 100%;
      color: $green;
      &.play-bar {
        background: linear-gradient($green,$yellow);
        color: #fff!important;
        i {
          color: #fff
        }
      }
    }
    li {
      text-align: center;
      float: left;
      height: 100%;
      font-size: 0;
      width: 20%;
      &.active {
        color: $yellow;
        i {
          color: $yellow;
        }
      }
      &.avatar {
        i {
         font-size: 10px;
        }
        img {
          border-radius: 50%;
          height: 100%;
          width: 45px;
        }
        img.isRotate {
          animation: rotate 10s linear infinite;
        }
      }
      &.flex,.click-to-play {
        flex-direction: column;
        span:first-child {
          flex: 1;
          height: 30px;
          line-height: 30px;
        }
        span:last-child {
          flex: 1;
          height: 15px;
          line-height: 15px;
        }
      }
      span {
        font-size: 12px;
      }
      &.songinfo {
        width: 60%;
        &>.song-name {
          font-size: 14px;
        }
        &>.songers {
          font-size: 12px;
        }
        p {
          text-align: center;
          height: 22px;
          line-height: 22px;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      i {
        vertical-align: middle;
        font-size: 30px;
        &.icon-icon-,&.icon-yonghu {
          font-size: 26px;
        }
        &.icon-bofang, &.icon-zanting {
          font-size: 45px;
        }
      }
      .click-to-play i{
        font-size: 30px;
      }
    }
  }
</style>
