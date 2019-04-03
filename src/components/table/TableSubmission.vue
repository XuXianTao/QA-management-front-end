<script>
import baseTable from './_TableBase.vue'
import { submission as ApiSubmission } from '@/apis'
import { updateTable as libUpdateTable } from '@/libs'

export default {
  extends: baseTable,
  data() {
    return {
      meta: {
        name: '提交数据'
      },
      show_part: {
        adding: false
      },
      columns: [
        {
          title: 'ID_Submission',
          key: 'id'
        },
        {
          title: '问题',
          key: 'question'
        },
        {
          title: '匹配的回答',
          key: 'answer'
        },
        {
          title: '提问者',
          key: 'submitter'
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  disabled: params.row.answer === null
                },
                on: {
                  click: () => {
                    // console.log(params.row)
                    // console.log(params.row.getOwnPropertyNames())
                    this.$Modal.confirm({
                      title: '是否确认将该内容放入数据源中？',
                      content: `
                      ID_Submission: ${params.row.id}<br>
                      Question: ${params.row.question}<br>
                      Answer(aid: ${params.row.aid}): ${params.row.answer}
                      `,
                      onOk: () => {
                        ApiSubmission.addToData(params.row).then(
                          res => {
                            this.$Message.success(`【添加成功】<br>ID_ANSWER: ${res.data.data.aid}<br>ID_Question: ${res.data.data.id}<br>Question:${res.data.data.question}`)
                            this.$Message.warning('【提示】为了使新添加的问答生效，请在数据源列表进行数据训练')
                          }
                        ).then(
                          () => {
                            this.handleSubmissionItemDelete(params, false)
                          }
                        )
                      }
                    })
                    
                  }
                }
              }, '编入数据源'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.$emit('on-edit', params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '5px'
                },
                on: {
                  click: () => {
                    this.CofirmItemDelete(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  computed: {
    subject() {
      return this.$store.state.subject_selected
    }
  },
  methods: {
    selfUpdateTable() {
      return libUpdateTable(
        this,
        Object.assign(this.update_table_obj, {
          url: ApiSubmission.url.submission,
          data: {
            id: 'id',
            question: 'question',
            answer: 'answer.answer',
            submitter: 'submitter',
            aid: 'aid',
          },
        })
      )
    },
    CofirmItemDelete(params, show_mes = true) {
      return this.$Modal.confirm({
        title: '【注意】是否确认删除该提交数据',
        content: `是否删除该数据<br>ID: ${params.row.id} <br>Question: ${params.row.question} <br>Submitter: ${params.row.submitter}`,
        closable: true,
        okText: '删除',
        onOk: () => {
          this.handleSubmissionItemDelete(params, show_mes)
        },
        cancelText: '取消'
      })
    },
    handleSubmissionItemDelete(params, show_mes = true) {
      return ApiSubmission.deleteItem({
        id: params.row.id
      }).then(
        () => {
          if (show_mes) this.$Message.success('【删除成功】')
          this.updateTable()
        }
      )
    },
  }
}
</script>
