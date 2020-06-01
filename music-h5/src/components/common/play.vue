<template>
  <div id="play-page">
    <Header :title="songName" icon="icon-fenxiang" />
    <van-swipe :show-indicators="false" class="body" @change="getData" ref="swipe">
      <van-swipe-item>
        <section class="cover-picture">
          <div class="picture flex">
            <img :src="app.songPlaying.avatar" alt="" :class="{'isRotate': app.isPlay}">
          </div>
          <div class="extra-func">
            <span>
              <i class="iconfont icon-shoucang" :class="{like: isLike}" @click="downloadOrLike(1)"></i>
            </span>
            <span>
              <i class="iconfont icon-xiazai" @click="downloadOrLike(0)"></i>
            </span>
            <span class="comment">
              <i style="font-size: 12px;">{{comment.total > 999 ? '999+' : comment.total}}</i>
              <i class="iconfont icon-buoumaotubiao48" @click="toComment"></i>
            </span>
            <span>
              <i class="iconfont icon-buoumaotubiao11" @click="toSonglist"></i>
            </span>
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item>
        <section class="lyrics-poster">
          <div class="lyrics">
            {{lyrics || '暂无歌词'}}
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item class="swipe-item-comment">
        <CommentList :commentFirstPage="comment" />
      </van-swipe-item>
    </van-swipe>
    <section class="footer">
      <van-progress :percentage="app.progress" :show-pivot="false" />
      <ul class="clearfix">
        <li class="cycle-order">
          <i :class="['iconfont',cycleOrder[cycleOrderCount].icon]" @click="changeCycleOrder"></i>
        </li>
        <li class="prev">
          <i class="iconfont icon-48shangyishou" @click="playNextOrPrev(0)"></i>
        </li>
        <li class="play-pause">
          <i :class="{'iconfont': true, 'icon-zanting': app.isPlay, 'icon-bofang': !app.isPlay}" @click="app.playPause"></i>
        </li>
        <li class="next">
          <i class="iconfont icon-49xiayishou" @click="playNextOrPrev(1)"></i>
        </li>
        <li class="play-list-btn">
          <i class="iconfont icon-bofangliebiao" @click="showPlayList"></i>
        </li>
      </ul>
    </section>
    <!-- 播放列表 -->
    <div class="playlist-modal">
      <PlayList
        :cycleOrder="cycleOrder"
        :cycleOrderCount="cycleOrderCount"
      />
    </div>
    <!-- 歌单列表 -->
    <div class="songlist-modal">
      <van-popup v-model="isShowSonglist">
        <div class="songlist-container">
          <h3>收藏到歌单</h3>
          <ul class="songlist">
            <li
              v-for="item in songlist"
              :key="item.id"
              class="flex"
              @click="collectToPlaylist(item.id)"
            >
              <div class="avatar">
                <img :src="item.playlistImgUrl || slistDefaultAvatar" alt="">
              </div>
              <div class="name flex">
                <span>{{item.name}}</span>
                <span>{{item.songIds ? item.songIds.split(',').length : 0}}首</span>
              </div>
            </li>
          </ul>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { Progress, Swipe, SwipeItem,Popup } from 'vant';
import PlayList from './playList';
import eventBus from '@/main';
import CommentList from './commentlist';
import slistDefaultAvatar from '@/assets/images/songlist-default.jpg'

export default {
  name: 'play',
  inject: {
    app: 'app'
  },
  data() {
    return {
      cycleOrder: [
        {
          text: '列表循坏',
          icon: 'icon-xunhuanbofang'
        },
        {
          text: '随机播放',
          icon: 'icon-suijibofang'
        },
        {
          text: '单曲循环',
          icon: 'icon-loop'
        }
      ],
      cycleOrderCount: 0,
      comment: {
        total: 0,
        comments: [],
        hotComments: []
      },
      lyrics: '',
      isShowSonglist: false,
      songlist: [],
      isLike: false,
      isDownload: false,
      slistDefaultAvatar
    };
  },
  computed: {
    songId(){
      return this.$common.getters.getPlayingSong.id
    },
    songName(){
      return this.$common.getters.getPlayingSong.name
    }
  },
  watch: {
    songId(val){
      this.$router.replace({
        name: 'play',
        params: { id: this.songId },
        query: { name: this.songName }
      })
      this.getComments()
    }
  },
  methods: {
    changeCycleOrder() {
      this.cycleOrderCount++;
      if (this.cycleOrderCount > 2) {
        this.cycleOrderCount = 0;
      }
      this.$toast(this.cycleOrder[this.cycleOrderCount].text);
    },
    showPlayList() {
      eventBus.$emit('update-isshow', true);
    },
    getData(index){
      if(index===1){
        this.$api.getLyric({id: this.songId})
        .then(res => {

        })
        .catch(error => {
          this.$toast('获取歌词失败')
        })
      }
      if(index===2){
        // this.getComments()
      }
    },
    toComment(){
      this.$refs.swipe.swipeTo(2)
    },
    toSonglist(){
      // 如果之前已经请求过歌单就不必再次请求
      if(this.songlist && this.songlist.length > 0){
        this.isShowSonglist = true
        return
      }
      this.$api.getUserPlaylist({
        uid: this.$common.getters.getUser.id
      })
      .then(res => {
        this.songlist = res.data.data
        this.isShowSonglist = true
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    },
    // 收藏歌曲到歌单
    collectToPlaylist(pid){
      this.$api.collectSong({
        uid: this.$common.getters.getUser.id,
        pid,
        sid: this.songId
      })
      .then(res => {
        this.$loading.hide()
        this.$toast('收藏成功')
        this.isShowSonglist = false
      })
      .catch(error => {
        this.$loading.hide()
        this.$toast(error.response.data.msg)
        this.isShowSonglist = false
      })
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    downloadOrLike(type){
      // if(type === 0) {
      //   this.$toast('开始下载')
      // }
      this.$api.downloadOrLikeSong({
        uid: this.$common.getters.getUser.id,
        sid: this.songId,
        type
      })
      .then(res => {
        if(type === 0){
          this.$toast('下载成功')
          this.isDownload = true
        }
        if(type === 1){
          this.isLike = res.data.operateType === 'delete' ? false : true
        }
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    },
    getComments(){
      this.$loading.show()
      // 获取歌曲评论
      this.$api.getSongComment({
        id: this.songId,
        limit: 10
      })
      .then(res => {
        this.$loading.hide()
        this.comment.total = res.data.total
        this.comment.comments = res.data.comments
        this.comment.hotComments = res.data.hotComments
      })
      .catch(error => {
        this.$loading.hide()
        this.$toast(error.response.data.msg)
      })
    },
    // 0为上一首，1为下一首
    playNextOrPrev(type){
      const playlistSongs = this.$common.getters.getPlaylist,
        playingSong = this.$common.getters.getPlayingSong

      if(playlistSongs.length < 2){
        this.$common.commit('changePlayingSong',playingSong)
        return false
      }
      let indexWillPlay
      if(type === 0){
        playlistSongs.forEach((item,index) => {
          if(item.id === playingSong.id){
            indexWillPlay = index-1 < 0 ? (playlistSongs.length-1) : (index-1)
          }
        })
      } else {
        playlistSongs.forEach((item,index) => {
          if(item.id === playingSong.id){
            indexWillPlay = index+1 > (playlistSongs.length-1) ? 0 : (index+1)
          }
        })
      }
      this.$common.commit('changePlayingSong',playlistSongs[indexWillPlay])
    }
  },
  created() {
    this.getComments()
  },
  components: {
    VanProgress: Progress,
    VanSwipe: Swipe,
    VanSwipeItem: SwipeItem,
    VanPopup: Popup,
    PlayList,
    CommentList
  }
};
</script>
<style lang="scss">
  #play-page {
    .body {
      height: calc(100vh - 45px - 80px);
      .cover-picture {
         background: linear-gradient($green,$yellow);
        color: #fff;
        height: 100%;
        .picture {
          height: calc(100% - 45px);
          padding: 0 45px;
          align-items: center;
          img {
            width: 100%;
            height: 230px;
            border: 35px solid black;
            border-radius: 50%;
          }
          img.isRotate {
            animation: rotate 20s linear infinite;
          }
        }
        .extra-func {
          height: 45px;
          font-size: 0;
          .comment {
            position: relative;
            i:first-child {
              display: inline-block;
              position: absolute;
              top: -20px;
              left: 20px;
            }
            .iconfont {
              display: inline-block;
              transform: rotate(180deg)
            }
          }
          span {
            display: inline-block;
            text-align: center;
            height: 45px;
            width: 25%;
            line-height: 45px;
          }
          i {
            font-size: 25px;
            color: #fff;
          }
          .like {
            color: $green;
          }
        }
      }
      .lyrics-poster {
        font-size: 14px;
        text-align: center;
        padding: 15px;
      }
      .swipe-item-comment {
        overflow: scroll;
      }
    }
    .footer {
      height: 80px;
      li {
        float: left;
        width: 20%;
        text-align: center;
        &>i {
          vertical-align: middle;
          font-size: 30px;
        }
        &.play-pause>i {
          font-size: 45px;
        }
      }
    }
    .songlist-modal {
      font-size: 14px;
      .van-popup {
        width: 80%;
        height: 60%;
        border-radius: 8px;
      }
    }
    .songlist-container {
      padding: 15px;
      height: 100%;
      .songlist {
        margin-top: 15px;
        .avatar {
          width: 55px;
          height: 55px;
          &>img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
        }
        .name {
          flex-direction: column;
          justify-content: center;
          margin-left: 5px;
        }
      }
    }
  }
</style>

