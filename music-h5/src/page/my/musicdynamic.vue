<template>
  <div id="dynamicCircle">
    <Header title="圈子动态" />
    <section class="share-dynamic">
      <header v-if="shareDynamic && shareDynamic.length > 0">朋友分享了</header>
      <header v-else>暂无动态</header>
      <div class="body">
        <div class="every-share" v-for="(item,index) in shareDynamic" :key="item.id">
          <div class="sharer flex" @click="toUserHomePage(item.uid)">
            <img :src="item.detail.creator.avatarUrl || userDefaultAvatar" alt="">
            <span>{{item.detail.creator.name}}</span>
          </div>
          <div class="share-content-container">
            <div class="share-content flex" @click="play(item.detail.song)">
              <div class="avatar">
                <img :src="item.detail.song.avatar" alt="">
              </div>
              <div class="name flex">
                <p>{{item.detail.song.name}}</p>
                <p>{{item.detail.song.artists.join('/')}}</p>
              </div>
            </div>
          </div>
          <div class="comment">
            <span>
              <i class="iconfont icon-zan" @click="like(item.id)"></i>{{item.like_number}}
            </span>
            <span>
              <i class="iconfont icon-buoumaotubiao48" @click="toTip"></i>
            </span>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="transmit-dynamic">
      <header>朋友转发了</header>
      <div class="body">
        <div class="every-transmit" v-for="(index,item) in transDynamic" :key="item.id">

        </div>
      </div>
    </section> -->
    <Footer />
  </div>
</template>
<script>
import userDefaultAvatar from '@/assets/images/user-default.jpg'
import CommentList from '@/components/common/commentlist';

export default {
  name: 'MusicDynamic',
  data(){
    return {
      userInfo: this.$common.getters.getUser,
      circleDynamic: [],
      userDefaultAvatar
    }
  },
  computed: {
    // 分享动态
    shareDynamic(){
      let share = this.circleDynamic.filter(item => item.type === 0)
      return share.map(item => ({
        ...item,
        detail: JSON.parse(item.detail)
      }))
    },
    // 转发动态
    transDynamic(){
      let transmit = this.circleDynamic.filter(item => item.type === 1)
      return transmit.map(item => ({
        ...item,
        detail: JSON.parse(item.detail)
      }))
    }
  },
  methods: {
    play(song) {
      // 让play的this指向当前实例
      this.$global.play.call(this,song)
    },
    toUserHomePage(id){
      this.$router.push({
        name: 'userhomepage',
        params: {
          id
        }
      })
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    like(id){
      this.$api.likeDynamic({
        id,
        type: 0
      })
      .then(res => {
        this.$reload()
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    }
  },
  created(){
    this.$loading.show()
    this.$api.getDynamic({
      id: this.userInfo.id
    })
    .then(res => {
      this.$loading.hide()
      this.circleDynamic = res.data.data
    })
    .catch(error => {
      this.$loading.hide()
      this.$toast(error.response.data.msg)
    })
  }
}
</script>
<style lang="scss">
  #dynamicCircle {
    .share-dynamic {
      // background: linear-gradient($green,$gray);
      height: calc(100vh - 101px);
      overflow: scroll;
      font-size: 14px;
      padding: 15px;
      header {
        margin-bottom: 15px;
      }
    }
    .every-share {
      .sharer {
        height: 45px;
        margin-bottom: 8px;
        // width: auto;
        align-items: center;
        &>img {
          height: 45px;
          width: 45px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
      .share-content-container {
        padding-left: 45px;
      }
      .share-content {
        // background: linear-gradient($green,$yellow);
        // color: #fff;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-shadow: 2px 3px 8px #ddd;
        .avatar {
          margin-right: 8px;
          &>img {
            height: 45px;
            width: 45px;
            border-radius: 6px;
          }
        }
        .name {
          flex-direction: column;
          &>p {
            font-size: 12px;
            flex: 1;
          }
        }
      }
      .comment {
        text-align: right;
        line-height: 35px;
        &>span {
          margin-left: 15px;
        }
        i {
          margin-right: 5px;
        }
      }
    }
  }
</style>
