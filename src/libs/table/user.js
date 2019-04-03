export default {
  name: '用户',
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
                this.modal_show = true
                let row = params.row
                Object.assign(this.user_info, {
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
              type: 'error'
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
  ]
}