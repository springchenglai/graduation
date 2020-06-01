<template>
  <div id="header">
    <ul class="clearfix">
      <li class="left">
        <i v-if="hasBack" class="iconfont icon-fanhui1" @click="goBack"></i>
        <i v-else class="iconfont icon-caidan" @click="toTip"></i>
      </li>
      <li class="center">
        <i class="title">{{title}}</i>
      </li>
      <li class="right" v-if="!!rightIcon">
        <i class="iconfont icon-sousuo"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import eventBus from '@/main'
export default {
  name: 'Header',
  data() {
    return {

    };
  },
  inject: {
    app: 'app'
  },
  computed: {
    song(){
      return this.$common.getters.getPlayingSong
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    toTip(){
      this.$toast('功能开发中，敬请期待')
    }
  },
  props: {
    hasBack: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss">
  #header {
    // background: linear-gradient($green, $gray);
    background: $green;
    color: #fff;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    border-bottom: 1px solid $gray;
    ul{
      height: 100%;
    }
    li {
      text-align: center;
      float: left;
      height: 100%;
      font-size: 0;
      &.left, &.right{
        width: 20%;
      }
      &.center {
        width: 60%;
        &>.title {
          font-size: 16px;
        }
      }
      &>i {
        vertical-align: middle;
        font-size: 25px;
        color: #fff;
      }
    }
  }
</style>

