<template>
  <div id="songlistHomePage">
    <section class="background-wall">
      <Header class="top" title="歌单" />
      <header class="flex">
        <div class="songlist-avatar-container">
          <img class="songlist-avatar" :src="songlist.playlistImgUrl || slistDefaultAvatar" alt=" /">
        </div>
        <div class="name flex">
          <div>{{songlist.name}}</div>
          <div class="creator-info flex" @click="toHomePage(songlist.creator.id)">
            <img class="creator-avatar" :src="songlist.creator && songlist.creator.avatar || userDefaultAvatar" alt="" />
            <span>{{songlist.creator && songlist.creator.name}}</span>
          </div>
        </div>
      </header>
      <div class="body">
        <div class="description">
          <p>{{songlist.description || '啥也没有呢'}}</p>
        </div>
        <ul class="clearfix extra-func">
          <li @click="toTip">
            <i class="iconfont icon-buoumaotubiao48"></i>
            评论
          </li>
          <li @click="toTip">
            <i class="iconfont icon-fenxiang"></i>
            分享
          </li>
          <li @click="toTip">
            <i class="iconfont icon-xiazai"></i>
            下载
          </li>
        </ul>
      </div>
    </section>
    <section :class="{'songs': true, 'fixed': isFixed}" ref="songs">
      <PlayList :hasHeader="false" :songIds="songlist.songIds" />
    </section>
  </div>
</template>
<script>
import { Cell, CellGroup } from "vant";
import PlayList2 from '@/components/common/playlist2';
import slistDefaultAvatar from '@/assets/images/songlist-default.jpg'
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: "SongListHomepage",
  data() {
    return {
      isFixed: false,
      songlist: {},
      id: this.$route.params.id,
      source: this.$route.query.source,
      slistDefaultAvatar,
      userDefaultAvatar
    }
  },
  methods: {
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    fixedSongs(){
      // 禁止默认滚动行为
      event.preventDefault();
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        offsetTop = this.$refs.songs && this.$refs.songs.offsetTop
      // this.$toast(scrollTop+':'+offsetTop);
      if(scrollTop>=offsetTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    reconstruct(playlist){
      let data = {},
        creator = {}
      if(this.source === 'my'){
        let userInfo = this.$common.getters.getUser
        creator = {
          id: userInfo.id,
          name: userInfo.name,
          avatar: userInfo.avatarUrl
        }
        data = {
          ...playlist,
          creator
        }
      } else {
        creator = {
          id: playlist.creator.userId,
          name: playlist.creator.nickname,
          avatar: playlist.creator.avatarUrl
        }
        const {id, name, description} = playlist,
          songIds = playlist.trackIds.map((item) => item.id).join(','),
          uid = playlist.userId,
          playlistImgUrl = playlist.coverImgUrl
        data = {
          id,
          uid,
          name,
          playlistImgUrl,
          songIds,
          description,
          creator
        }
      }
      return data
    },
    toHomePage(id){
      this.$router.push({
        name: 'userhomepage',
        params: {
          id
        }
      })
    }
  },
  created(){
    let api
    if(this.source === 'my'){
      api = 'getUserPlayListDetail'
    } else {
      api = 'getNetworkPlayListDetail'
    }
    this.$loading.show();
    this.$api[api]({
      id: this.id
    })
    .then(res => {
      this.$loading.hide()
      this.songlist = this.reconstruct(res.data.playlist)
      // console.log('has songsid:',this.songlist.songsId)
      // return this.$api.getSongDetail({
      //   ids: this.songlist.songsId
      // })
    })
    // .then(res => {
    //   debugger
    //   this.$loading.hide()
    //   this.songs = res.data.songs
    // })
    .catch(error => {
      this.$loading.hide()
      this.$toast(error.response.data.message || '未知错误')
    })
  },
  mounted(){
    window.addEventListener('scroll', this.fixedSongs)
  },
  beforeDestroyed(){
    window.removeEventListener('scroll', this.fixedSongs)
  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    PlayList: PlayList2
  }
}
</script>
<style lang="scss">
  #songlistHomePage {
    font-size: 14px;
    .background-wall {
      padding: 12px;
      height: 50vh;
      // background: linear-gradient($green,$yellow);
      background: url('../../assets/images/songlist-bg.jpg') no-repeat;
      background-size: cover;
      color: #fff;
      position: relative;
      i {
        color: #fff;
      }
      .top {
        border: none;
        background: transparent;
        margin: -12px 0 0 -12px;
      }
      header {
        &>.name {
          flex: 1;
          flex-direction: column;
          padding-left: 15px;
          align-items: flex-start;
          &>.creator-info {
            flex: 1;
            align-items: center;
          }
        }
        .songlist-avatar {
          height: 75px;
          width: 75px;
          border-radius: 6px;
        }
        .creator-avatar {
          height: 35px;
          width: 35px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
      .body {
        padding-top: 15px;
        // height: 50%;
        &>.description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 12px;
          // height: 100%;

        }
        &>.extra-func {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
        li {
          float: left;
          margin-left: 25px;
          line-height: 35px;
        }
      }
    }
    .songs {
      background-color: #fff;
      position: relative;
      #playList2 {
        padding-top: 44px;
         header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
      &.fixed {
        height: 100vh;
        z-index: 1000;
        .header {
          position: fixed;
          background: $green;
          color: #fff;
        }
        .body {
          height: calc(100vh - 44px);
          overflow: scroll;
        }
      }
    }
  }
</style>

