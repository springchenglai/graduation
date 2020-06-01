<template>
  <div id="personInfoEdit">
    <Header title="编辑个人信息" />
    <article class="content">
      <section class="vatar-edit">
        <div class="background-wall">
          <div class="avatar">
            <img :src="userInfo.avatarUrl || userDefaultAvatar" alt="">
          </div>
          <div class="edit-text">
            点击编辑
          </div>
          <input type="file" id="file" @change="uploadImage()" accept=".png, .jpg, .jpeg" stype="" />
        </div>
      </section>
      <section class="info-edit">
        <van-cell-group>
          <van-field
            v-model="userInfoModel.name"
            type="text"
            label="昵称"
            placeholder="还没想好要写什么呢"
          />
          <van-field
            v-model="userInfoModel.signature"
            type="text"
            label="个性签名"
            placeholder="还没想好要写什么呢"
          />
          <van-cell title="性别">
            <template>
              <van-radio-group v-model="userInfoModel.gender" class="gender-radio">
                <van-radio :name="1">女</van-radio>
                <van-radio :name="0">男</van-radio>
              </van-radio-group>
            </template>
          </van-cell>
          <!-- <van-field
            v-model="userInfo.address"
            type="text"
            label="所在地"
          /> -->
        </van-cell-group>
      </section>
    </article>
    <van-button :class="{'save-btn': true, 'disable': !userInfoModel.name}" @click="saveEdit">确定</van-button>
  </div>
</template>
<script>
import { Cell, CellGroup, Field, RadioGroup, Radio, Button } from "vant";
import userDefaultAvatar from '@/assets/images/user-default.jpg'

export default {
  name: "EditInfo",
  data() {
    let user = this.$common.getters.getUser
    return {
      userInfoModel: {
        id: user.id,
        name: user.name,
        gender: user.gender,
        signature: user.signature
      },
      userDefaultAvatar
    }
  },
  computed: {
    userInfo(){
      return this.$common.getters.getUser
    }
  },
  methods: {
    saveEdit(){
      this.$loading.show();
      this.$api.editUserInfo(this.userInfoModel)
      .then(res => {
          this.$toast("修改成功");
          // 修改成功之后重新获取用户信息并存储
          return this.$common.dispatch('getUserInfo', {
            id: this.userInfo.id
          });
        })
        .then(res => {
          this.$loading.hide();
          this.$router.push({ name: "person" });
        })
        .catch(error => {
          this.$loading.hide();
          this.$toast(error.message);
        });
    },
    uploadImage(){
      let formData = new FormData()
      const file = event.target.files[0]
      formData.append('file',file)
      formData.append('id',this.userInfo.id)
      this.$loading.show()
      this.$api.uploadImage(formData)
      .then(res => {
        this.$loading.hide();
        this.$toast("上传成功")
        this.$common.commit('saveUserInfo',{...this.userInfo, avatarUrl: res.data.avatarUrl})
      })
      .catch(error => {
        this.$loading.hide();
        this.$toast(error.message);
      })
    }
  },
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanField: Field,
    VanRadioGroup: RadioGroup,
    VanRadio: Radio,
    VanButton: Button
  }
}
</script>
<style lang="scss">
 @import "@/styles/mixins.scss";

  #personInfoEdit {
    font-size: 14px;
    position: relative;
    .content {
      overflow: scroll;
      // height: calc(100vh - 45px - 40px);
      .vatar-edit {
        padding: 15px;
        height: 40%;
        .background-wall {
          height: 150px;
          background: url('../../assets/images/user-bg.jpg') no-repeat;
          background-size: cover;
          // background: linear-gradient($green, $yellow);
          border-radius: 8px;
          position: relative;
          .avatar, #file {
            width: 100px;
            height: 100px;
            @include centerPisition()
          }
          #file {
            z-index: 1001;
            // visibility: hidden; 不能参与交互？？
            opacity: 0;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
          .edit-text {
            color: #fff;
            font-weight: bold;
            @include centerPisition()
          }
        }
      }
      .info-edit {
        .gender-radio {
          display: flex;
          .van-radio {
            flex: 1;
          }
        }
      }
    }
    .save-btn {
      margin-top: 45px;
    }
  }
</style>

