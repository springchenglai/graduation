<template>
  <div id="register">
    <Header title="用户注册"/>
    <div class="register-form">
      <van-field
        v-model="email"
        clearable
        label="邮箱"
        placeholder="请输入邮箱"
      />
      <van-field
        v-model="nickName"
        clearable
        label="用户名"
        placeholder="请输入用户名"
      />
      <van-field
        v-model="password"
        clearable
        label="密码"
        placeholder="请输入密码"
        type="password"
      />
    </div>
    <div class="register-btn">
      <van-button round @click="register">注册</van-button>
    </div>
  </div>
</template>
<script>
import { Button,Field } from "vant";

export default {
  name: "register",
  data() {
    return {
      email: '',
      password: '',
      nickName: ''
    };
  },
  methods: {
    register() {
      if (!this.email || !this.password || !this.nickName) {
        this.$toast("输入信息不完整");
      } else {
        this.$loading.show();
        this.$api.register({
          email: this.email,
          password: this.password,
          name: this.nickName
        })
        .then(res => {
          this.$loading.hide();
          this.$toast('注册成功')
          this.$router.push('/login')
        })
        .catch(error => {
          this.$loading.hide();
          this.$toast(error.response.data.msg);
        });
      }
    }
  },
  components: {
    VanButton: Button,
    VanField: Field
  }
};
</script>
<style lang="scss">
#register {
  height: 100%;
  // min-height: 100%;
  .register-form {
    margin-top: 35px;
  }
  .register-btn {
    // 键盘弹出时会影响布局
    // position: absolute;
    // top: 50%;
    // width: 100%;
    margin-top: 45px;
  }
}
</style>
