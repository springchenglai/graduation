<template>
  <div id="myMusic">
    <Header title="我的音乐" :hasBack="false" />
    <div class="content">
      <van-cell-group>
        <van-cell>
          <div slot="title" @click="toPlayList(0)">
            <i class="iconfont icon-music"></i>
            本地音乐({{download.length}})
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" @click="toTip()">
            <i class="iconfont icon-icon-test"></i>
            最近播放({{playRecord.length}})
          </div>
        </van-cell>
        <van-cell>
          <div slot="title" @click="toPlayList(1)">
            <i class="iconfont icon-icon-test"></i>
            我喜欢({{like.length}})
          </div>
        </van-cell>
      </van-cell-group>
      <van-collapse v-model="spreadName" accordion>
        <van-collapse-item
          class="my-songlist"
          title="我的歌单"
          name="1"
        >
          <van-icon slot="icon" name="plus" @click="isShowCrtSlModal=true" />
          <ul>
            <li
              v-for="item in songlist"
              :key="item.id"
              class="flex"
              @click="toSongListHome(item)"
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
        </van-collapse-item>
      </van-collapse>
      <van-popup v-model="isShowCrtSlModal" class="create-songlist-modal">
        <div>
          <div class="title">新建歌单</div>
          <div class="body">
            <van-field
              v-model="songlistName"
              placeholder="请输入歌单名称"
            />
            <van-field
              v-model="songlistDesc"
              placeholder="请输入歌单描述"
            />
          </div>
          <div class="footer">
            <i @click="isShowCrtSlModal=false">取消</i>
            <i @click="createPlaylist" :class="{nosubmit: !songlistName}">提交</i>
          </div>
        </div>
      </van-popup>
    </div>
    <Footer />
  </div>
</template>
<script>
import {
  Collapse,
  CollapseItem,
  Cell,
  CellGroup,
  Icon,
  Popup,
  Field
} from "vant";
import slistDefaultAvatar from '@/assets/images/songlist-default.jpg'
export default {
  name: "MyMusic",
  data() {
    return {
      userInfo: this.$common.getters.getUser,
      songlist: [],
      playRecord: [],
      download: [],
      like: [],
      spreadName: '1',
      isShowCrtSlModal: false,
      songlistName: '',
      songlistDesc: '',
      slistDefaultAvatar
    };
  },
  methods: {
    toPlayList(type) {
      let text = "";
      switch (type) {
        case 0:
          text = "本地音乐";
          break;
        case 2:
          text = "最近播放";
          break;
        case 1:
          text = "我喜欢";
          break;
        default:
          break;
      }
      this.$router.push({
        name: "playlist",
        query: { type, keyword: text }
      });
    },
    filterSongs(data){
      this.download = data.filter(song => song.type === 0)
      this.like = data.filter(song => song.type === 1)
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    toSongListHome(data) {
      this.$router.push({
        name: "songlisthomepage",
        params: {
          id: data.id
        },
        query: {
          source: 'my'
        }
      });
    },
    // 创建歌单
    createPlaylist(){
      this.$loading.show()
      this.$api.createPlaylist({
        uid: this.userInfo.id,
        name: this.songlistName,
        description: this.songlistDesc
      })
      .then(res => {
        this.$loading.hide()
        this.$toast('创建成功')
        this.$reload()
      })
      .catch(error => {
        this.$loading.hide()
        this.$toast('创建失败')
        this.$reload()
      })
    }
    // 测试generator函数
    /* * testAsync(){
      console.log('1')
      var result = yield this.$api.getMusicUrl({
        id: 405998841
      })
      debugger
      console.log('2')
    } */
  },
  // 测试generator函数
  /* mounted(){
    var g = this.testAsync()
    debugger
    var result = g.next()
    debugger
    result.value.then(function(data){
      debugger
      return data.data
    }).then(function(data){
      debugger
      g.next(data)
      debugger
    })
  }, */
  created() {
    const getUserPlaylist = this.$api.getUserPlaylist({
      uid: this.userInfo.id
    })
    const getUserSongs = this.$api.getUserSongs({
      uid: this.userInfo.id,
      type: 2
    })
    // Promise.all确保两个异步请求完成才让用户操作页面
    this.$loading.show()
    Promise.all([getUserPlaylist, getUserSongs])
    .then(resArr => {
      this.$loading.hide()
      this.songlist = resArr[0].data.data
      this.filterSongs(resArr[1].data.data)
    })
    .catch(error => {
      this.$loading.hide()
      this.$toast(error.response.data.msg)
    })
  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanCollapse: Collapse,
    VanCollapseItem: CollapseItem,
    VanIcon: Icon,
    VanPopup: Popup,
    VanField: Field
  }
};
</script>
<style lang="scss">
  #myMusic {
    font-size: 14px;
    .content {
      height: calc(100vh - 101px);
      overflow: scroll;
    }
    .user-info-title {
      height: 45px;
      img {
        height: 45px;
        width: 45px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
      }
      span {
        vertical-align: middle;
      }
    }
    .van-cell-group {
      .van-cell {
        i {
          margin-right: 10px;
        }
        &::after {
          left: 41px;
        }
      }
      &::after {
        border: none;
      }
    }
    .my-songlist {
      li {
        margin-bottom: 15px;
        align-items: center;
      }
      .van-icon-arrow, .van-icon-plus {
        height: 45px;
        line-height: 45px;
      }
      .van-icon-plus {
        margin-right: 15px;
      }
      .van-cell__title>span {
        // vertical-align: middle;
        @include verticalCenterPisition
      }
      .avatar {
        // z-index: 1;
        width: 55px;
        height: 55px;
        &>img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }
      .name {
        // height: 50%;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
        // margin-left: -5px;
        // background: linear-gradient($green,$yellow);
        // border-radius: 6px;
        // color: #fff;
      }
    }
    .create-songlist-modal {
      // height: 40vh;
      width: 80vw;
      border-radius: 6px;
      padding: 15px;
      .title {
        font-size: 16px;
      }
      .body {
        margin: 15px 0;
      }
      .footer {
        text-align: right;
        &>i {
          display: inline-block;
          // width: 45px;
          line-height: 35px;
          margin-left: 15px;
          &.nosubmit {
            pointer-events: none;
            opacity: 0.5;
          }
        }
      }
    }
  }
</style>
