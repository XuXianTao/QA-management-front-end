<template>
  <div>
    <TableUser ref="table" @on-edit="handleUserEdit"/>
    <ModalUserUpdate :modal-show="modal_show" :user-info="user_info" :subjects="subjects" @show-cancel="modal_show = false" @save-success="handleUpdateSuccess"/>
    <ModalSignUp />
  </div>
</template>

<script>
import TableUser from '@/components/table/TableUser.vue'
import ModalUserUpdate from '@/components/modal/UserUpdate.vue'
import ModalSignUp from '@/components/modal/UserSignup.vue'
import {
  subject as ApiSubject
} from '@/apis'
export default {
  components: {
    TableUser,
    ModalUserUpdate,
    ModalSignUp
  },
  data() {
    return {
      modal_show: false,
      user_info: {
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
      },
      subjects: []
    }
  },
  watch: {
    modal_show(nVal) {
      if (nVal) {
        this.user_info.pw_changing = false
      }
      else {
        this.user_info.id = null
      }
    }
  },
  created() {
    ApiSubject.getAll().then(
      res => this.subjects = res.data.data.list
    )
  },
  methods: {
    handleUserEdit(params) {
      this.modal_show = true
      Object.assign(this.user_info, params)
    },
    handleUpdateSuccess() {
      this.$Message.success('保存成功')
      this.$refs.table.updateTable()
      this.$store.commit('refreshSubjects')
      this.modal_show = false
    }
  }
}
</script>
