<template>
  <van-popup
    v-model="isShow"
    class="play-list"
    position="bottom"
  >
    <section class="header clearfix">
      <div class="left">
        <i :class="['iconfont',cycleOrder[cycleOrderCount].icon]"></i>
        <i class="text">{{cycleOrder[cycleOrderCount].text}}</i>
      </div>
      <div class="right" @click="toTip">
        <i class="iconfont icon-shanchu"></i>
      </div>
    </section>
    <section class="body">
      <ul>
        <li
          v-for="item in playlistSongs"
          :key="item.id"
          class="flex"
          :class="{playing: item.id === playingSongId}"
        >
          <i class="iconfont icon-shengyin"></i>
          <span @click="play(item)">{{item.name}} - {{item.artists.join('/')}}</span>
          <i class="iconfont icon-fork" @click="removeFromList(item.id)" v-if="item.id !== playingSongId"></i>
        </li>
      </ul>
    </section>
  </van-popup>
</template>
<script>
import { Popup } from 'vant';
import eventBus from '@/main';

export default {
  name: 'playList',
  data() {
    return {
      isShow: false
    };
  },
  props: ['cycleOrder', 'cycleOrderCount'],
  computed: {
    playingSongId(){
      return this.$common.getters.getPlayingSong && this.$common.getters.getPlayingSong.id
    },
    playlistSongs(){
      return this.$common.getters.getPlaylist
    }
  },
  methods: {
    removeFromList(id){
      let playlistNew = this.$common.getters.getPlaylist.filter(song => song.id !== id)
      this.$common.commit('changePlaylist', playlistNew)
    },
    play(song) {
      // 让play的this指向当前实例
      this.$global.play.call(this,song)
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    }
  },
  created() {
    eventBus.$on('update-isshow', data => {
      this.isShow = data;
    });
  },
  components: {
    VanPopup: Popup
  }
};
</script>
<style lang="scss">
  .play-list {
    @include layoutPisition(fixed,40%,0,0,0);
    transform: translate3d(0,0,0);
    overflow: hidden;
    .header {
      padding: 12px;
      font-size: 0;
      .left {
        float: left;
        .text {
          font-size: 14px;
          margin-left: 8px;
        }
      }
      .right {
        float: right;
      }
      i {
        display: inline-block;
        font-size: 20px;
        vertical-align: middle;
      }
    }
    .body {
      font-size: 12px;
      padding: 0 15px;
      li {
        line-height: 35px;
        &.playing {
          color: $yellow;
        }
        span {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      i {
        font-size: 14px;
        &.icon-shengyin {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
