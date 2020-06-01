<template>
<section id="playList2">
  <Header :title="title" icon="icon-sousuo" v-if="hasHeader" />
  <header class="header clearfix" v-if="hasHeaderFunc">
    <div class="left">
      <i class="iconfont icon-bofang"></i>
      <i class="text">播放全部(共{{songsArray.length}}首)</i>
    </div>
    <div class="right" @click="toTip">
      <i class="iconfont icon-caidan"></i>
      <i class="text">多选</i>
    </div>
  </header>
  <div class="body">
    <van-list>
      <van-cell
        v-for="(item) in songs"
        :key="item.id"
      >
        <template slot="title">
          <div class="song-info" @click="play(item)">
            <p>{{item.name}}<span v-if="!!item.aliaName">({{item.aliaName}})</span></p>
            <p class="singer-info">{{item.artists.join('/')}}-{{item.album}}</p>
          </div>
        </template>
        <template>
          <i class="iconfont icon-bofang1" @click="toTip"></i>
          <i class="iconfont icon-moreif" @click="showSongInfoModal(item)"></i>
        </template>
        <template slot="icon" v-if="playingSongId === item.id">
          <i class="iconfont icon-shengyin voice"></i>
        </template>
      </van-cell>
    </van-list>
  </div>
  <!-- 歌曲信息弹层 -->
  <van-popup
    v-model="songInfoModal.isShow"
    position="right"
    class="song-extra-info-modal"
  >
    <div class="song-extra-info">
      <div class="add-playlist" @click="addPlaylist">
        <i class="iconfont icon-tubiaozhizuomoban"></i>
        <span>添加到播放列表</span>
      </div>
      <div class="collect-to-playlist" @click="toSonglist">
        <i class="iconfont icon-buoumaotubiao11"></i>
        <span>收藏到歌单</span>
      </div>
      <div class="share-to-circle" @click="shareToMyCircle">
        <i class="iconfont icon-fenxiang"></i>
        <span>分享到我的音乐圈</span>
      </div>
    </div>
  </van-popup>
  <!-- 歌单弹层 -->
  <van-popup
    v-model="isShowSonglistModal"
    class="songlist-modal"
  >
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
</section>
</template>
<script>
import { Popup } from 'vant';
import { List } from 'vant';
import { Cell } from 'vant';
import eventBus from '@/main';
import slistDefaultAvatar from '@/assets/images/songlist-default.jpg'

export default {
  name: 'playList2',
  data() {
    return {
      songsArray: [],
      songIdsCopy: this.songIds,
      songInfoModal: {
        isShow: false,
        song: {}
      },
      isShowSonglistModal: false,
      songlist: [],
      slistDefaultAvatar
    };
  },
  computed: {
    title() {
      return this.$route.query.keyword;
    },
    playingSongId(){
      return this.$common.getters.getPlayingSong && this.$common.getters.getPlayingSong.id
    },
    songs(){
      return this.songsArr.length > 0 ? this.songsArr : this.songsArray
    }
  },
  watch: {
    // songIds依赖于父组件的异步行为，所有一开始是没有的
    songIds(ids){
      this.getSongDetailByIds(ids)
    },
    songIdsCopy(ids){
      this.getSongDetailByIds(ids)
    }
  },
  props: {
    hasHeader: {
      type: Boolean,
      default: true
    },
    hasHeaderFunc: {
      type: Boolean,
      default: true
    },
    songIds: {
      type: String,
      default: ''
    },
    songsArr: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    play(song) {
      // 让play的this指向当前实例
      this.$global.play.call(this,song)
    },
    // 重新组织歌曲数据结构
    reconstruct(data) {
      const list = data.map(item => ({
        id: item.id,
        name: item.name,
        aliaName: item.alia.join('/'),
        avatar: item.al.picUrl,
        artists: item.ar.map(art => art.name),
        album: item.al.name
      }));
      return list;
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    changeSongIdsCopy(data){
      const songIdsArr = data.map(record => record.sid)
      this.songIdsCopy = songIdsArr.join(',')
    },
    // 获取所有歌曲的详情
    getSongDetailByIds(ids){
      if(ids){
        this.$loading.show();
        this.$api.getSongDetail({
          ids
        })
        .then(res => {
          this.$loading.hide()
          this.songsArray = this.reconstruct(res.data.songs)
        })
        .catch(error => {
          this.$loading.hide()
          this.$toast(error.response.data.msg)
        })
      }
    },
    // 收藏歌曲到歌单
    collectToPlaylist(pid){
      this.$loading.show()
      this.$api.collectSong({
        uid: this.$common.getters.getUser.id,
        pid,
        sid: this.songInfoModal.song.id
      })
      .then(res => {
        this.$loading.hide()
        this.$toast('收藏成功')
        this.isShowSonglistModal = false
      })
      .catch(error => {
        this.$loading.hide()
        this.$toast(error.response.data.msg)
        this.isShowSonglistModal = false
      })
    },
    // 弹出歌曲信息弹层
    showSongInfoModal(item){
      this.songInfoModal.isShow = true;
      this.songInfoModal.song = item
    },
    // 弹出歌单弹层
    toSonglist(){
      // 如果之前已经请求过歌单就不必再次请求
      if(this.songlist && this.songlist.length > 0){
        this.isShowSonglistModal = true
        this.songInfoModal.isShow = false
        return
      }
      this.$api.getUserPlaylist({
        uid: this.$common.getters.getUser.id
      })
      .then(res => {
        this.songlist = res.data.data
        this.isShowSonglistModal = true
        this.songInfoModal.isShow = false
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    },
    // 添加到播放列表
    addPlaylist(){
      const playlistBefore = this.$common.getters.getPlaylist
      const idsArr = playlistBefore.map(song => song.id);
      if(idsArr.includes(this.songInfoModal.song.id)){
        this.$toast('已在播放列表中')
        this.songInfoModal.isShow = false
      } else {
        this.$common.commit('changePlaylist',playlistBefore.concat(this.songInfoModal.song))
        this.$toast('已添加到播放列表')
        this.songInfoModal.isShow = false
      }
    },
    // 分享到我的音乐圈
    shareToMyCircle(){
      this.$api.generateDynamic({
        id: this.$common.getters.getUser.id,
        type: 0,
        detail: {
          song: this.songInfoModal.song,
          creator: this.$common.getters.getUser
        }
      })
      .then(res => {
        this.$toast('分享成功')
        this.songInfoModal.isShow = false
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
        this.songInfoModal.isShow = false
      })
    }
  },
  created() {
    // console.log('songids of created:',this.songIds)
    const type = this.$route.query.type
    let api = ''
    if(this.$route.name === 'playlist'){
      if(type == 0 || type == 1){
        api = 'getUserSongs'
      }
      if(type === 2){
        // 获取最近播放的歌曲的ids
        api = 'getUserSongs'
      }
      this.$api[api]({
        uid: this.$common.getters.getUser.id,
        type: type
      })
      .then(res => {
        this.changeSongIdsCopy(res.data.data)
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    }
  },
  mounted(){
    // console.log('songids of mounted:',this.songIds)
  },
  components: {
    VanList: List,
    VanCell: Cell,
    VanPopup: Popup
  }
};
</script>
<style lang="scss">
  #playList2 {
    .header {
      padding: 12px;
      font-size: 0;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
      i {
        display: inline-block;
        vertical-align: middle;
        &.iconfont {
          font-size: 20px;
        }
        &.text {
          font-size: 14px;
          margin-left: 8px;
        }
      }
    }
    .body {
      i {
        &.voice {
          color: $yellow;
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }
      .song-info {
        font-size: 14px;
        .singer-info {
          font-size: 12px;
        }
      }
      .van-cell__value {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        &>.icon-bofang1 {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
    .van-cell__title {
      flex: 3;
    }
    .song-extra-info-modal {
      width: 60%;
      height: 50%;
      border-radius: 8px;
      margin-right: -15px;
    }
    .song-extra-info {
      font-size: 12px;
      height: 100%;
      padding: 10px;
      // color: #aaa;
      div {
        line-height: 35px;
        position: relative;
        span,i {
          vertical-align: middle;
        }
        &::after {
          content: '';
          border-bottom: 1px solid #ddd;
          position: absolute;
          bottom: 0;
          left: 25px;
          right: 0;
        }
      }
      i {
        font-size: 18px;
        margin-right: 5px;
        &.icon-buoumaotubiao11 {
          font-size: 16px;
        }
      }
    }
    .songlist-modal {
      font-size: 14px;
      width: 80%;
      height: 60%;
      border-radius: 8px;
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
