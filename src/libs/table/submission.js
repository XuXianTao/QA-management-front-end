import { submission as ApiSubmission } from '@/apis'
export default function(vue) {
  return {
    name: '提交信息',
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
                  vue.$Modal.confirm({
                    title: '是否确认将该内容放入数据源中？',
                    content: `
                    ID_Submission: ${params.row.id}<br>
                    Question: ${params.row.question}<br>
                    Answer(aid: ${params.row.aid}): ${params.row.answer}
                    `,
                    onOk: () => {
                      ApiSubmission.addToData(params.row).then(
                        res => {
                          vue.$Message.success(`【添加成功】<br>ID_ANSWER: ${res.data.data.aid}<br>ID_Question: ${res.data.data.id}<br>Question:${res.data.data.question}`)
                          vue.handleSubmissionItemDelete(params, false)
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
                  Object.assign(vue.editing, {
                    id: params.row.id,
                    answer: params.row.answer,
                    aid: params.row.aid
                  })
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
                  vue.handleSubmissionItemDelete(params)
                }
              }
            }, '删除')
          ])
        }
      }
    ]
  }
}