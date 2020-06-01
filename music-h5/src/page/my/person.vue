<template>
  <div id="person">
    <section class="background-wall logined" v-if="userInfo && userInfo.id">
      <header class="flex" @click="toUserHomePage">
        <div class="name flex">
          <p>{{userInfo.name}}</p>
          <p><i class="level">Lv.{{userInfo.level || 1}}</i></p>
          <!-- <p>{{userInfo.signature}}</p> -->
        </div>
        <div class="avatar">
          <!-- <img src="../../assets/images/user-default.jpg" alt=""> -->

          <img :src="userInfo.avatarUrl || userDefaultAvatar" alt="">
        </div>
      </header>
      <div class="body">
        <div class="edit-info">
          <router-link to="/person/editinfo">编辑个人信息</router-link>
        </div>
        <ul class="clearfix counter">
          <li>
            <router-link
              :to="{name: 'friendslist', params: { id: userInfo.id }, query: { l: 0, type: 'fans'}}"
            >
              粉丝&nbsp;{{userInfo.fans | convertNumber}}
            </router-link>
          </li>
          <li>
            <router-link
              :to="{name: 'friendslist', params: { id: userInfo.id }, query: { l: 1, type: 'attention'}}"
            >
              关注&nbsp;{{userInfo.attention | convertNumber}}
            </router-link>
          </li>
          <!-- <li>
            <router-link
              :to="{name: 'friendslist', params: { id: userInfo.id }, query: { l: 2, type: 'attention'}}"
            >
              累计播放&nbsp;0
            </router-link>
          </li> -->
        </ul>
      </div>
    </section>
    <section class="background-wall unlogin" v-else>
      <header>个人中心</header>
      <div class="body">
        <router-link to="/login">登录&nbsp;</router-link>
        <router-link to="/register">&nbsp;注册</router-link>
      </div>
    </section>
    <section class="other-setting">
      <van-cell-group>
        <van-cell title="会员中心" icon="vip-card-o" is-link @click="toTip" />
        <van-cell title="我的好友" icon="friends-o" is-link @click="toMyFriend" />
        <van-cell title="主题换肤" is-link @click="toTip" >
          <i class="iconfont icon-pifu van-cell__left-icon" slot="icon"></i>
        </van-cell>
      </van-cell-group>
    </section>
    <div class="exit-btn-container" v-if="userInfo && userInfo.id">
      <van-button class="exit-btn" @click="exit">退出</van-button>
    </div>
    <Footer />
  </div>
</template>
<script>
import { Cell, CellGroup, Button } from "vant";
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: "person",
  data() {
    return {
      userDefaultAvatar
      // userInfo: this.$common.getters.getUser
    }
  },
  computed: {
    userInfo(){
      return this.$common.getters.getUser
    }
  },
  methods: {
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    toUserHomePage(){
      this.$router.push({
        name: 'userhomepage',
        params: {
          id: this.userInfo.id
        }
      })
    },
    toMyFriend(){
      this.$router.push({
        name: 'friendslist',
        params: {
          id: this.userInfo.id
        },
        query: {
          l: 0,
          type: 'fans'
        }
      })
    },
    exit(){
      this.$common.commit('saveUserInfo',{})
      localStorage.removeItem('token')
      this.$reload()
    }
  },
  filters: {
    convertNumber(value){
      if(!value) return 0
      return value.split(',').length
    }
  },
  created(){

  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanButton: Button
  }
}
</script>
<style lang="scss">
  #person {
    min-height: 100vh;
    font-size: 14px;
    position: relative;
    .background-wall {
      padding: 12px;
      height: 40vh;
      background: url('../../assets/images/user-bg.jpg') no-repeat;
      background-size: cover;
      // background: linear-gradient($green, $yellow);
      color: #fff;
      position: relative;
      header {
        &>.name {
          flex: 1;
          flex-direction: column;
          p {
            flex: 1;
            line-height: 25px;
          }
          p:first-child {
            font-size: 26px;
          }
          .level {
            border: 1px solid #fff;
            padding: 0 2px;
            font-size: 8px;
          }
        }
        img {
          height: 75px;
          width: 75px;
          border-radius: 50%;
        }
      }
      .body {
        margin-top: 35px;
        &>.counter {
          position: absolute;
          bottom: 0;
        }
        &>.edit-info {
          text-align: right;
        }
        li {
          float: left;
          margin-right: 15px;
          line-height: 35px;
        }
      }
      &.unlogin {
        header {
          font-size: 26px;
        }
        .body {
          font-size: 16px;
        }
      }
    }
    .exit-btn-container {
      position: absolute;
      bottom: 66px;
      width: 100%;
    }
  }
</style>

