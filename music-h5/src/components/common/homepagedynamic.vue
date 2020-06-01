<template>
  <div id="myDynamic">
    <section class="share-dynamic">
      <header v-if="!myShareDynamic || myShareDynamic.length<1">暂无动态</header>
      <header v-else-if="userInfo.id === currUser.id">我分享了</header>
      <header v-else>TA分享了</header>
      <div class="body">
        <div class="every-share" v-for="(item,index) in myShareDynamic" :key="item.id">
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
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: 'MusicDynamic',
  data(){
    return {
      currUser: this.$common.getters.getUser,
      circleDynamic: [],
      userDefaultAvatar
    }
  },
  props: ['userInfo'],
  computed: {
    // 我的分享动态
    myShareDynamic(){
      let share = this.circleDynamic.filter(item => {
        return item.type === 0 && item.uid === this.userInfo.id
      })
      return share.map(item => ({
        ...item,
        detail: JSON.parse(item.detail)
      }))
    }
  },
  methods: {
    play(song) {
      // 让play的this指向当前实例
      this.$global.play.call(this,song)
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
  #myDynamic {
    .share-dynamic {
      font-size: 14px;
      header {
        margin-bottom: 15px;
      }
    }
    .every-share {
      margin-top: 15px;
      .share-content {
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 6px;
        .avatar {
          margin-right: 8px;
          &>img {
            height: 45px;
            width: 45px;
            border-radius: 6px;
          }
        }
        .name {
          font-size: 12px;
          flex-direction: column;
          &>p {
            font-size: 12px;
            flex: 1;
          }
        }
      }
    }
  }
</style>
