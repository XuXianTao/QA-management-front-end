<script>
import baseTable from './_TableBase.vue'
import ModalSignup from '@/components/modal/UserSignup.vue'
import {updateTable as libUpdateTable} from '@/libs'
import {
  user as ApiUser
} from '@/apis'

export default {
  extends: baseTable,
  data() {
    return {
      meta: {
        name: '用户'
      },
      columns: [
        {
          title: '账户',
          key: 'account'
        },
        {
          title: '管理科目',
          render: (h, params) => {
            return h('div', params.row.subjects.map(item => item.name).join('，'))
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: 'primary'
                },
                on: {
                  click:() => {
                    let row = params.row
                    this.$emit('on-edit', {
                      id: row.id,
                      account: row.account,
                      subjects: row.subjects,
                      sids: row.subjects.map(item => item.id)
                    })
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'error',
                  disabled: params.row.account === 'admin'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.handelUserDel(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      default_add_item_modal: ModalSignup
    }
  },
  computed: {
    modal_options() {
      return {
        instance: ModalSignup,
        data: {
          'modal-signup': this.adding.show
        },
        events: {
          'signup-success': (res) => {
            Object.assign(this.adding, {
              show: false,
              content: ''
            })
            this.updateTable()
            this.$Message.success(`创建用户成功<br>Account: ${res.data.data.account}`)
          },
          'show-cancel': () => {
            Object.assign(this.adding, {
              show: false,
              content: ''
            })
          }
        }
      }
    }
  },
  created() {
    this.updateTable()
  },
  methods: {
    selfUpdateTable() {
      return libUpdateTable(this,
        Object.assign(this.update_table_obj, {
          url: ApiUser.url.user,
          data: {
            account: 'account',
            subjects: 'usersubject',
            id: 'id'
          },
        })
      )
    },
    handelUserDel(row) {
      this.$Modal.confirm({
        title: '确认删除改用户',
        content: `
        ID: ${row.id},<br>
        Account: ${row.account},<br>
        科目: ${row.subjects.length>0?row.subjects.map(item => item.name):'空'}
        `,
        onOk: () => {
          ApiUser.deleteItem(row.id).then(
            () => {
              this.updateTable()
              this.$Message.success('删除成功')
            }
          )
        }
      })
    }
  }
}
</script>
