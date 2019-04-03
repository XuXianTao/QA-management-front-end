<template>
  <div class="app">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>问答数据管理系统</h1>
    <Form id="user-form" ref="formInline" :model="formInline" :rules="ruleInline" :label-width=50 label-position="right" class="login">
      <FormItem class="input" prop="account" label="账号">
        <Input v-model="formInline.account" type="text" prefix="ios-contact" class="input-input" placeholder="Account" />
      </FormItem>
      <FormItem class="input" prop="password" label="密码">
        <Input ref="formInline-password" v-model="formInline.password" type="password" prefix="ios-key" class="input-input" placeholder="Password" @keyup.enter.native="handleLogin" />
      </FormItem>
      <FormItem :label-width=0 class="input">
        <Button id="btn-login" type="primary" long @click="handleLogin">登录</Button>
        <Button id="btn-signup" type="text" long @click="modal_signup = true;">注册</Button>
      </FormItem>
    </Form>
    <ModalSignup :modal-signup="modal_signup" @show-cancel="modal_signup = false; " @signup-success="handleSignupSuccess"/>
  </div>

</template>

<script>
import ModalSignup from '@/components/modal/UserSignup.vue'
import {
  user as ApiUser
  } from '@/apis'
export default {
  components: {
    ModalSignup
  },
  data() {
    return {
      formInline: {
        account: "",
        password: ""
      },
      ruleInline: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码不能少于6位数",
            trigger: "blur"
          }
        ]
      },
      modal_signup: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs["formInline"].validate(valid => {
        if (valid) {
          ApiUser.login({
            account: this.formInline.account,
            secret: this.md5(this.formInline.password)
          }).then(
            res => {
              let data = res.data;
              let MSG_LOGIN = ApiUser.msg_login[data.message];
              this.$Message[MSG_LOGIN.type](MSG_LOGIN.info);
              if (MSG_LOGIN.type === 'success') {
                this.$store.commit('login', data.data.type)
                this.$store.commit('setSubjects', data.data.subjects)
                this.$router.push('/main')
              }
            }
          )
        } else {
          this.$Message.error("错误!登录账号或密码输入不符合要求！");
        }
      });
    },
    handleSignupSuccess(res) {
      let data = res.data;
      if (data.code == 201) {
        this.$Message.success("注册成功");
        this.formInline.account = res.data.data.account;
        this.formInline.password = "";
        this.modal_signup = false;
        this.$refs["formInline"].validate();
        this.$refs["formInline-password"].focus();
      }
    }
  }
};
</script>


<style lang="stylus" scoped>
.app
  margin-top 60px
.login {
  border-radius: 5px;
  box-shadow: 0 0 5px #dcdee2;
  width: 400px;
  margin: 20px auto;
  padding: 20px;

  .input {
    margin-top: 20px;
    text-align: center;

    &:last-child {
      margin-bottom: 0;
    }

    #btn {
      &-signup {
        margin-top: 10px;
      }
    }
  }
}
</style>

