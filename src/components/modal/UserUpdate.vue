<template>
  <Modal :value="modalShow" :loading="modal_loading" @on-ok="handleSaveUser" @on-cancel="$emit('show-cancel')">
    <p slot="header" style="text-align: center; color: #2d8cf0">
      <Icon type="ios-information-circle"></Icon>
      <span>修改用户信息</span>
    </p>
    <Form ref="user_info" :model="userInfo" :label-width=80 :rules="userInfo.rules">
      <FormItem prop="account" label="账号">
        <Input v-model="userInfo.account" disabled/>
      </FormItem>
      <FormItem label="管理科目">
        <Select v-model="userInfo.sids" multiple>
          <Option v-for="item in subjects" :key="item.id" :value="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="!userInfo.pw_changing">
        <Button type="primary" long @click="userInfo.pw_changing = true">修改密码</Button>
      </FormItem>
      <div v-else>
        <FormItem prop="pw" label="新密码">
          <Input v-model="userInfo.pw" type="password"></Input>
        </FormItem>
        <FormItem prop="pw_confirm" label="再次输入">
          <Input v-model="userInfo.pw_confirm" type="password"></Input>
        </FormItem>
        <FormItem>
          <Button type="dashed" long @click="userInfo.pw_changing = false">取消</Button>
        </FormItem>
      </div>
    </Form>
  </Modal>
</template>

<script>
import {
  user as ApiUser,
  // subject as ApiSubject
} from '@/apis'

export default {
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => ({
        id: null,
        account: null,
        pw: null,
        pw_confirm: null,
        subjects: [],
        sids: [],
        pw_changing: false,
        rules: {
          account: {required: true, message: '用户名不能为空', trigger: 'blur'} 
        }
      })
    },
    subjects: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      modal_loading: true,
    }
  },
  watch: {
    'userInfo.pw_changing'(nVal) {
      if (nVal) {
        Object.assign(this.userInfo.rules, {
          pw: [
            { required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, message: '密码至少输入6位', trigger: 'blur'}
          ],
          pw_confirm: [
            { required: true, message: '请再次输入密码', trigger: 'blur'},
            { validator: (rule, value, callback) => {
              if (value !== this.userInfo.pw) {
                callback(new Error('与第一次密码输入不一致'))
              }
              else {
                callback()
              }
            }, trigger: 'blur'}
          ]
        })
      }
      else {
        Object.assign(this.userInfo.rules, {
          pw: [],
          pw_confirm: []
        })
        Object.assign(this.userInfo, {
          pw: null,
          pw_confirm: null
        })
      }
    },
  },
  methods: {
    handleSaveUser() {
      this.$refs.user_info.validate( (valid) => {
        if (valid) {
          ApiUser.updateItem({
            id: this.userInfo.id,
            sids: this.userInfo.sids,
            password: this.userInfo.pw?this.md5(this.userInfo.pw):null,
            type: 'update_user'
          }).then(
            () => {
              this.$emit('save-success')
            }
          )
        }
        else {
          this.$Message.error('输入不符合要求')
          this.modal_loading = false
          this.$nextTick(() => this.modal_loading = true)
        }
      })
    },
  }
}
</script>
