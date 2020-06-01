<template>
<div id="friendList">
  <Header :title="tagConfig[currIndex].name" />
  <van-tabs v-model="activeTagModal" swipeable @change="tabToggle">
    <van-tab
      v-for="(item,index) in tagConfig"
      :title="item.name"
      :key="item.id"
    >
      <van-list
      >
        <van-cell
          v-if="!item.data || item.data.length < 1"
          title="什么也没有呢"
          class="nothing"
        />
        <van-cell
          v-for="item1 in item.data"
          :key="item1.id"
          class="every-friend"
          @click="toHomePage(item1.id)"
        >
          <div slot="title" class="title flex">
            <img :src="item1.avatarUrl || userDefaultAvatar" alt="">
            <div class="user-info">
              <p>{{item1.name}}</p>
              <p class="signature">{{item1.signature || '啥也没有呢'}}</p>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-tab>
  </van-tabs>
</div>

</template>
<script>
import { Tab, Tabs, List, Cell } from 'vant';
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: 'FriendsList',
  data(){
    return {
      tagConfig: [
        {
          name: '粉丝',
          id: 'fans',
          api: 'getUserFans',
          data: []
        },
        {
          name: '关注',
          id: 'attention',
          api: 'getUserAttention',
          data: []
        }
      ],
      activeTagModal: this.$route.query.l || 0,
      id: this.$route.params.id,
      userDefaultAvatar
    }
  },
  computed: {
    currIndex() {
      return this.$route.query.l
      // let cindex;
      // this.tagConfig.forEach((item,index)=> {
      //   item.id === this.$route.params.id && (cindex = index)
      // })
      // return cindex
    },
  },
  created(){
    this.getData(this.currIndex)
  },
  beforeRouteUpdate(to, from, next){
    let toIndex = to.query.l
    // 如若之前加载过，就不再加载
    if(!this.tagConfig[toIndex].data || this.tagConfig[toIndex].data.length<1){
      this.getData(toIndex)
    }
    next()
  },
  methods: {
    tabToggle(index,title){
      this.$router.replace({
        name: 'friendslist',
        params: {
          id: this.id
        },
        query: {
          l: index,
          type: this.tagConfig[index].id
        }
      })
    },
    getData(index){
      let api = this.tagConfig[index].api
      this.$loading.show()
      this.$api[api]({
        id: this.id
      })
      .then(res => {
        this.$loading.hide();
        let cTagConfig = this.tagConfig[index]
        this.tagConfig.splice(index,1,{
          ...cTagConfig,
          data: res.data.data
        })
      })
      .catch(error => {
        this.$loading.hide();
        this.$toast(error.message);
      });
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
  components: {
    VanTab: Tab,
    VanTabs: Tabs,
    VanList: List,
    VanCell: Cell
  }
}
</script>
<style lang="scss">
  #friendList {
    .every-friend {
      .title {
        img {
          height: 50px;
          width: 50px;
          border-radius: 50%;
        }
        .user-info {
          margin: 0 15px;
          &>.signature {
            font-size: 12px;
          }
        }
      }
    }
    .nothing {
      padding: 50px;
      text-align: center;
      color: #aaa;
    }
  }
</style>

