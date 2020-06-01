<template>
  <div id="commentList">
    <section v-if="comment && comment.total > 0">
      <header>
        <h3>{{title}}</h3>
      </header>
      <div class="body">
        <article class="hot-comments" v-if="!isShowAllComment">
          <section class="every-comment" v-for="(item,index) in comment.hotComments" :key="index">
            <div class="commentor flex">
              <div class="user flex">
                <img :src="item.user.avatarUrl" alt="">
                <span>{{item.user.nickname}}</span>
              </div>
              <div class="praise">
                <span>{{item.likedCount}}</span>
                <i class="iconfont icon-zan" @click="toTip"></i>
              </div>
            </div>
            <div class="comment-content">
              <p>{{item.content}}</p>
            </div>
          </section>
        </article>
        <article class="all-comments" v-if="isShowAllComment">
          <section class="every-comment" v-for="(item,index) in comment.comments" :key="item.commentId">
            <div class="commentor flex">
              <div class="user flex">
                <img :src="item.user.avatarUrl" alt="">
                <span>{{item.user.nickname}}</span>
              </div>
              <div class="praise">
                <span>{{item.likedCount}}</span>
                <i class="iconfont icon-zan" @click="toTip"></i>
              </div>
            </div>
            <div class="comment-content">
              <p>{{item.content}}</p>
            </div>
          </section>
        </article>
        <div class="check-comment">
          <div class="check-allcomment" v-if="!isShowAllComment">
            <van-button round @click="toggleComment">查看全部评论</van-button>
          </div>
          <div class="check-hotcomment" v-else>
            <span @click="toggleComment">查看热评</span>
            <span @click="toPage(currentPage+1)" v-if="currentPage!==pageNumber">下一页</span>
            <span @click="toPage(currentPage-1)" v-if="currentPage!==1">上一页</span>
            <span @click="toPage(1)" v-if="currentPage!==1">首页</span>
            <span @click="toPage(pageNumber)" v-if="currentPage!==pageNumber">尾页</span>
          </div>
        </div>
      </div>
    </section>
    <section class="nocomment" v-else>
      暂无评论
    </section>
  </div>
</template>
<script>
import { Button } from 'vant'

export default {
  name: 'CommentList',
  data(){
    return {
      isShowAllComment: false,
      currentPage: 1,
      comment: this.commentFirstPage
    }
  },
  watch: {
    // 当前页数改变时去拉取相应页的数据
    currentPage(topage){
      this.$loading.show()
      this.$api.getSongComment({
        id: this.$route.params.id,
        limit: 10,
        offset: (topage-1)*10
      })
      .then(res => {
        this.$loading.hide()
        this.comment.comments = res.data.comments
      })
      .catch(error => {
        this.$loading.hide()
        this.$toast(error.message)
      })
    }
  },
  computed: {
    title(){
      if(this.isShowAllComment){
        return '全部评论('+this.comment.total+')'
      } else {
        return '精彩热评('+this.comment.hotComments.length+')'
      }
    },
    pageNumber(){
      return Math.ceil(this.comment.total/10)
    }
  },
  props: ['commentFirstPage'],
  methods: {
    toTip(){
      this.$toast('功能开发中，敬请期待')
    },
    toggleComment(){
      this.isShowAllComment = !this.isShowAllComment
      this.toTop()
    },
    toPage(page){
      if(page < 1){
        this.currentPage = 1
      } else if(page > this.pageNumber){
        this.currentPage = this.pageNumber
      } else {
        this.currentPage = page
      }
      this.toTop()
    },
    toTop(){
      document.getElementsByClassName('swipe-item-comment')[0].scrollTop = 0
    }
  },
  components: {
    VanButton: Button
  }
}
</script>
<style lang="scss">
  #commentList {
    font-size: 14px;
    padding: 10px;
    .nocomment {
      text-align: center;
    }
    header {
      margin-bottom: 15px;
    }
    .check-comment {
      margin-bottom: 18px;
      text-align: center;
      button {
        border-color: #ddd;
      }
      span {
        margin-right: 15px;
      }
    }
    .every-comment {
      margin-bottom: 15px;
      .commentor {
        height: 45px;
        margin-bottom: 8px;
        .user {
          flex: 1;
          height: 100%;
          align-items: center;
        }
        img {
          height: 100%;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
      .comment-content {
        font-size: 13px;
      }
    }
  }
</style>


