<template>
  <div id="login">
    <Header title="用户登录"/>
    <div class="login-form">
      <van-field
        v-model="email"
        clearable
        label="邮箱"
        placeholder="请输入邮箱"
      />
      <van-field
        v-model="password"
        clearable
        label="密码"
        placeholder="请输入密码"
        type="password"
      />
    </div>
    <div class="login-btn">
      <van-button round @click="login">登录</van-button>
    </div>
  </div>
</template>
<script>
import { Button,Field } from "vant";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  inject: {
    app: 'app'
  },
  components: {
    VanButton: Button,
    VanField: Field
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        this.$toast("账号或密码不能为空");
      // } else if (!/1\d{10}/.test(this.textInput)) {
      //   this.$toast("请输入正确格式的账号(邮箱)");
      } else {
        this.$loading.show();
        this.$common.dispatch('loginByEmail', {
          email: this.email,
          password: this.password
        })
        .then(res => {
          this.$loading.hide();

          // 从哪里来回哪里去
          window.location.href = this.$route.query.redirect ? this.$route.query.redirect : '/'
        })
        .catch(error => {
          this.$loading.hide();
          this.$toast(error.response.data.msg);
        });
      }
    }
  },
  created(){
    // 登录页面不展示音频控件
    // this.app.isShowAudio = false
  }
};
</script>
<style lang="scss">
#login {
  height: 100vh;
  position: relative;
  .header {
    height: 45px;
  }
  .login-form {
    margin-top: 35px;
  }
  .login-btn {
    margin-top: 45px;
  }
}
</style>