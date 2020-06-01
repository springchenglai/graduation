<template>
  <div id="recommend">
    <Header :hasBack="false" title="发现好音乐"></Header>
    <article class="content">
      <section class="recommend-newsong">
        <div class="header">
          新歌推荐
        </div>
        <div class="body">
          <PlayList :hasHeader="false" :hasHeaderFunc="false" :songsArr="recommendNewSongs" />
        </div>
      </section>
      <section class="recommend-songlist">
        <div class="header">
          歌单推荐
        </div>
        <div class="body">
          <div
            class="card-song flex"
            v-for="(item,index) in recommendSonglist"
            :key="item.id"
            @click="toSongListHome(item)"
          >
            <div class="song-img">
              <img :src="item.picUrl" alt="">
            </div>
            <div class="song-info flex">
              <div class="songers-name text-ellipsis">{{item.copywriter}}</div>
              <div class="song-name text-ellipsis">{{item.name}}</div>
            </div>
          </div>
        </div>
      </section>
    </article>
    <Footer />
  </div>
</template>
<script>
import PlayList from '@/components/common/playlist2';

export default {
  name: 'recommend',
  data(){
    return {
      recommendNewSongs: [],
      recommendSonglist: []
    }
  },
  methods: {
    reconstructSong(data){
      const newData = data.map(item => ({
        id: item.song.id,
        name: item.song.name,
        aliaName: item.song.alias.join('/'),
        avatar: item.song.album.picUrl,
        artists: item.song.artists.map(art => art.name),
        album: item.song.album.name
      }))
      return newData
    },
    toSongListHome(data) {
      this.$router.push({
        name: "songlisthomepage",
        params: {
          id: data.id
        },
        query: {
          source: 'network'
        }
      });
    }
  },
  created(){
    // 获取推荐新音乐
    const getRecommendNewsong = this.$api.getRecommendNewsong()

    // 获取推荐歌单
    const getRecommendSonglist = this.$api.getRecommendSonglist()

    this.$loading.show()
    Promise.all([getRecommendNewsong, getRecommendSonglist])
    .then(resArr => {
      this.$loading.hide()
      this.recommendNewSongs = this.reconstructSong(resArr[0].data.result.length > 10 ? resArr[0].data.result.slice(0,10) : resArr[0].data.result)
      this.recommendSonglist = resArr[1].data.result.length > 10 ? resArr[1].data.result.slice(0,10) : resArr[1].data.result
    })
    .catch(error => {
      this.$loading.hide()
      this.$toast(error.response.data.msg)
    })
  },
  components: {
    PlayList
  }
}
</script>
<style lang="scss">
  #recommend {
    font-size: 14px;
    height: 100vh;
    .content {
      height: calc(100vh - 101px);
      overflow: scroll;
    }
    .recommend-newsong,.recommend-songlist {
      .header {
        padding: 8px 8px 0;
        font-size: 16px;
      }
    }
    .recommend-songlist {
      .card-song {
        width: 90%;
        margin: 15px auto;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 2px 5px 8px #ddd;
        .song-img {
          width: 30%;
          &>img {
            width: 100%;
          }
        }
        .song-info {
          flex-direction: column;
          width: 70%;
          padding-left: 8px ;
          &>.songers-name {
            // width: 100%;
            font-size: 12px;
          }
          &>.song-name {
            // width: 100%;
            font-size: 16px;
            margin-top: 15px;
          }
        }
      }
    }
  }
</style>
