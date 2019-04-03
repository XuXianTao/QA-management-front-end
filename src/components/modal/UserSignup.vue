<template>
  <Modal :value="modalSignup" width="500" @on-cancel="handleShowCancel">
    <p slot="header" style="text-align:center">
      <!-- <Icon type="ios-information-circle"></Icon> -->
      <span>注册新用户</span>
    </p>
    <Form ref="formSignup" :label-width="100" :model="formSignup" :rules="ruleSignup">
      <FormItem label="账号" prop="account">
        <Input v-model="formSignup.account" type="text" />
      </FormItem>
      <FormItem label="科目" prop="subject">
        <Select v-model="formSignup.subject" :loading="formSignup.subject_loading" type="subject" multiple>
          <Option v-for="item in subjects" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="formSignup.password" type="password" />
      </FormItem>
      <FormItem label="确认密码" prop="reconfirm">
        <Input v-model="formSignup.reconfirm" type="password" @keyup.enter.native="handleSignup" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleSignup">注册</Button>
      <Button @click="modalSignup = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import {
  subject as ApiSubject, 
  user as ApiUser
  } from '@/apis'

export default {
  props: {
    modalSignup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formSignup: {
        account: "",
        subject: "",
        subject_loading: true,
        password: "",
        reconfirm: ""
      },
      subjects: [
      ],
      ruleSignup: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        subject: [
          {
            required: true,
            message: '请选择用户科目',
            type: 'array',
            min: 1,
            trigger: 'blur'
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
        ],
        reconfirm: [
          {
            required: true,
            message: "请再次确认输入的密码",
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value !== this.formSignup.password) {
                callback(new Error("与密码输入不一致"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    }
  },
  created() {
    ApiSubject.getAll().then(
      res => {
        let data = res.data.data.list;
        let result = [];
        data.forEach(el => {
          result.push({
            id: el.id,
            title: el.name
          })
        });
        this.subjects = result;
        this.formSignup.subject_loading = false;
      }
    )
  },
  methods: {
    handleShowCancel() {
      this.$emit('show-cancel')
    },
    handleSignup() {
      this.$refs["formSignup"].validate(valid => {
        if (valid) {
          return ApiUser.signup({
            account: this.formSignup.account,
            secret: this.md5(this.formSignup.password),
            sids: this.formSignup.subject
          }).then(
            res => {
              this.$emit('signup-success', res)
            }
          )
        } else {
          this.$Message.error("错误！注册信息的输入不符合规范！");
        }
      });
    }
  }
}
</script>
