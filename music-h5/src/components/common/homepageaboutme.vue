<template>
  <div id="homePageAboutMe">
    <section class="user-info">
      <header>基本信息</header>
      <div class="body">
        <p>昵称：{{userInfo.name}}</p>
        <p>等级：{{userInfo.level || 1}}</p>
        <p>性别：{{gender}}</p>
        <p>邮箱：{{userInfo.email}}</p>
        <p>职业：{{userInfo.profession || '未知'}}</p>
        <p>所在地：{{userInfo.address || '未知'}}</p>
      </div>
    </section>
    <section class="user-introduction">
      <header>个人介绍</header>
       <div class="body">
         <p>{{userInfo.signature || '啥也没有呢'}}</p>
       </div>
    </section>
  </div>
</template>
<script>

export default {
  name: "HomePageAboutMe",
  data() {
    return {
      // userInfo: this.$common.getters.getUser
    }
  },
  props: ['userInfo'],
  computed: {
    gender(){
      let gender = this.userInfo.gender;
      if(gender === 0){
        return '男'
      } else if(gender === 1) {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  methods: {

  },
  created(){

  },
  components: {

  }
}
</script>
<style lang="scss">
 @import "@/styles/mixins.scss";
  #homePageAboutMe {
    font-size: 14px;
    position: relative;
    .user-info,.user-introduction {
      header {
        margin-bottom: 8px;
      }
      p {
        line-height: 25px;
      }
      .body {
        color: #7d7e80;
        font-size: 12px;
      }
    }
    .user-info {
      margin-bottom: 15px;
    }
  }
</style>

