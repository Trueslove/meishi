<template>
    <div class="login">
        <div class="login-img">
          <img src="../assets/timg.jpg" alt=""/>
        </div>
        <div class="login-form">
          <input type="text" v-model="phone" placeholder="请输入账号"/>
          <input type="password" v-model="password" placeholder="请输入密码"/>
        </div>
        <button class="main-btn" @click="handleSubmit">点击登录</button>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "login",
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    handleSubmit() {
      if (!this.phone) {
        this.$toast.fail("账号不能为空");
        return false;
      } else if (!this.password) {
        this.$toast.fail("密码不能为空");
        return false;
      } else {
        let { phone, password } = this
        axios.post("/pub/api/user/login", {phone, password}).then((res) => {
           if(res.data.code == 0) {
            this.$toast.success("登陆成功");
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
              this.$router.push({
                path: "/"
              });
            }
          }).catch((error) => {
            console.warn(error)
          })
       
      }
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../assets/timg.jpg") no-repeat;
  background-size: 100% 100%; 
  position:absolute;
  .login-form {
    width: 90%;
    margin: auto;
    >input {
      color: #fff;
      font-size: 14px;
      width: calc(100% - 8px);
      height: 50px;
      line-height: 50px;
      line-height: 100%;
      border-radius: 25px;
      border: none;
      padding: 0 16px;
      background-color: rgba(255, 255, 255, .2);
      margin-bottom: 10px;
    }
    >input::-webkit-input-placeholder {
      color: #EDF1F9;
      font-size: 14px;
    }
  }
  .login-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin: 80px auto 40px;
    overflow: hidden;
    >img {
      width: 100%;
      height: 100%;
    }
  }
  .main-btn {
    width: 70%;
    border-radius: 10px;
    background-color: #FF9302;
    margin-top: 50px;
  }
}
</style>

