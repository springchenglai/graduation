<template>
  <div id="personalHomePage">
    <section class="background-wall">
      <Header class="top" />
      <header class="flex">
        <div class="name flex">
          <p>{{userInfo.name}}</p>
          <p>
            <i class="level">Lv.{{userInfo.level || 1}}</i>
            <i class="attention" v-if="CanAttention" @click="attention">关注他</i>
          </p>
        </div>
        <div class="avatar">
          <img :src="userInfo.avatarUrl || userDefaultAvatar" alt="">
        </div>
      </header>
      <div class="body">
        <div class="signature">
          <p>{{userInfo.signature || '啥也没有呢'}}</p>
        </div>
        <ul class="clearfix counter">
          <li>
            <router-link
              :to="{name: 'friendslist', params: { id }, query: { l: 0, type: 'fans'}}"
            >
              粉丝&nbsp;{{userInfo.fans | convertNumber}}
            </router-link>
          </li>
          <li>
            <router-link
              :to="{name: 'friendslist', params: { id }, query: { l: 1, type: 'attention'}}"
            >
              关注&nbsp;{{userInfo.attention | convertNumber}}
            </router-link>
          </li>
        </ul>
      </div>
    </section>
    <section :class="{'dynamic': true, 'fixed': isFixed}" ref="dynamic">
      <van-tabs v-model="activeTag" swipeable @change="tabToggle">
        <van-tab title="音乐">
          <HomePageMusic :userInfo="userInfo" />
        </van-tab>
        <van-tab title="动态">
          <HomePageDynamic :userInfo="userInfo" />
        </van-tab>
        <van-tab title="个人信息">
          <HomePageAboutMe :userInfo="userInfo" />
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>
<script>
import { Cell, CellGroup, Tab, Tabs } from "vant";
import HomePageMusic from "@/components/common/homepagemusic"
import HomePageDynamic from "@/components/common/homepagedynamic"
import HomePageAboutMe from "@/components/common/homepageaboutme"
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: "UserHomePage",
  data() {
    return {
      userInfo: {},
      activeTag: 0,
      isFixed: false,
      id: this.$route.params.id,
      currUid: this.$common.getters.getUser.id,
      userDefaultAvatar
    }
  },
  computed: {
    CanAttention(){
      if(this.id == this.currUid){
        return false
      }
      const fansArr = this.userInfo.fans ? this.userInfo.fans.split(',') : []
      if(fansArr.includes(this.currUid+'')){
        return false
      }
      return true
    }
  },
  methods: {
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    tabToggle(item){

    },
    fixedDynamic(){
      let scrollTop = document.documentElement.scrollTop,
        offsetTop = this.$refs.dynamic && this.$refs.dynamic.offsetTop
      if(scrollTop>=offsetTop) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    attention(){
      this.$api.attentionUser({
        cid: this.currUid,
        id: this.id
      })
      .then(res => {
        this.$toast('关注成功')
        this.$reload()
      })
      .catch(error => {
        this.$toast(error.response.data.msg)
      })
    }
  },
  created(){
    this.$loading.show()
    this.$api.getUserInfo({
      id: this.id
    })
    .then(res => {
      this.$loading.hide()
      this.userInfo = res.data.data
    })
    .catch(error => {
      this.$loading.hide()
      this.$toast(error.response.data.message)
    })
  },
  mounted(){
    window.addEventListener('scroll', this.fixedDynamic)
  },
  beforeDestroyed(){
    window.removeEventListener('scroll', this.fixedDynamic)
  },
  filters: {
    convertNumber(value){
      if(!value) return 0
      return value.split(',').length
    }
  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanTab: Tab,
    VanTabs: Tabs,
    HomePageMusic,
    HomePageAboutMe,
    HomePageDynamic
  }
}
</script>
<style lang="scss">
  #personalHomePage {
    font-size: 14px;
    .background-wall {
      padding: 12px;
      height: 50vh;
      // background: linear-gradient($green, $yellow);
      background: url('../../assets/images/user-bg.jpg') no-repeat;
      background-size: cover;
      color: #fff;
      position: relative;
      .top {
        border: none;
        background: transparent;
        margin: -12px 0 0 -12px;
      }
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
          .attention {
            margin-left: 8px;
            color: $yellow;
            font-size: 12px;
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
        li {
          float: left;
          margin-right: 15px;
          line-height: 35px;
        }
      }
    }
    .dynamic {
      background-color: #fff;
      .van-tabs__content {
        padding: 15px;
      }
      &.fixed {
        height: 100vh;
        z-index: 1000;
        .van-tabs__wrap {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
        }
        .van-tabs__content {
          height: calc(100vh - 44px);
          overflow: scroll;
        }
      }
    }
  }
</style>

