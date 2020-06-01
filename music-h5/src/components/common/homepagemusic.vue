<template>
  <div id="homePageMusic">
    <section>
      <header>
        <p>歌单&nbsp;<span>{{songlist.length}}</span></p>
      </header>
      <div class="body">
        <van-cell-group>
          <van-cell v-for="item in songlist" :key="item.id">
            <div slot="title" class="songlist-info flex" @click="toSongListHome(item)">
              <div class="avatar">
                <img :src="item.playlistImgUrl || slistDefaultAvatar" alt="">
              </div>
              <div class="name flex">
                <span>{{item.name}}</span>
                <span>{{item.songIds | getSongsNumber}}首</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </div>
    </section>
  </div>
</template>
<script>
import { Cell, CellGroup } from "vant";
import slistDefaultAvatar from '@/assets/images/songlist-default.jpg'

export default {
  name: "HomePageMusic",
  data() {
    return {
      songlist: [],
      slistDefaultAvatar
    };
  },
  methods: {
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
    }
  },
  created(){
    this.$loading.show()
    this.$api.getUserPlaylist({
      uid: this.$route.params.id
    })
    .then(res => {
      this.$loading.hide()
      this.songlist = res.data.data
    })
    .catch(error => {
      this.$toast(error.data.message)
      this.$loading.hide()
    })
  },
  filters: {
    getSongsNumber(ids){
      return ids ? ids.split(',').length : 0
    }
  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup
  }
};
</script>
<style lang="scss">
  #homePageMusic {
    header {
      // font-size: 14px;
      span {
        color: #7d7e80;
      }
    }
    .body {
      .songlist-info {
        font-size: 12px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 6px;
        }
        .name {
          margin-left: 15px;
          flex-direction: column;
          // span:last-child {
          //   font-size: 12px;
          // }
        }
      }
    }
  }
</style>
