<script>
import baseTable from './_TableBase.vue'
import { updateTable as libUpdateTable } from "@/libs";
import { question as ApiQuestion } from "@/apis";

const buttonStyle = {
  margin: '5px'
}
export default {
  extends: baseTable,
  props: {
    aid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      meta: {
        name: "问题"
      },
      columns: [
        {
          title: "ID_QUESTION",
          key: "id",
          render: (h, params) => {
            let row = params.row;
            return this.is_editing(row) ? h('Input', {
              props: {
                disabled: true,
                value: this.editing.id
              }
            }) : h('span', row.id)
          }
        },
        {
          title: "问题",
          key: "question",
          render: (h, params) => {
            let row = params.row
            return this.is_editing(row) ? h('Input', {
              props: {
                autosize: true,
                type: 'textarea',
                value: this.editing.question
              },
              on: {
                input: str => this.editing.question = str
              }
            }) : h('span', row.question)
          }
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            let row = params.row
            return this.is_editing(row) ? h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: buttonStyle,
                on: {
                  click: this.handleItemSave
                }
              }, '保存'),
              h('Button', {
                props: {
                  type: 'text'
                },
                style: buttonStyle,
                on: {
                  click: this.handleItemCancel
                }
              }, '取消')
            ]) : h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: buttonStyle,
                on: {
                  click: () => this.handleItemChange(row)
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: buttonStyle,
                on: {
                  click: () => this.handleItemDel(row)
                }
              }, '删除')
            ])
          }
        }
      ],
      editing: {
        id: null,
        question: ""
      },

      pagination: {
        limit: 6,
        total: null,
        page: 1
      }
    };
  },
  watch: {
    aid() {
      this.updateTable()
    }
  },
  methods: {
    is_editing(row) {
      return row.id === this.editing.id
    },
    selfUpdateTable() {
      return libUpdateTable(this, {
        params: {
          aid: this.aid,
          search: this.search_value,
          sid: this.subject.id,
          page: this.pagination.page ? this.pagination.page - 1 : null,
          limit: this.pagination.limit
        },
        url: ApiQuestion.url.question,
        res_data_arr: 'list',
        data: {
          id: 'id',
          question: 'question'
        }
      })
    },
    handleItemDel(row) {
      this.$Modal.confirm({
        title: '是否确认删除问题',
        content: '是否删除该问题<br>ID:' + row.id + '<br>Question:' + row.question,
        closable: true,
        okText: '删除',
        onOk: () => {
          ApiQuestion.deleteItem({
            id: row.id
          }).then(() => {
            this.$Message.success('【删除成功】')
            this.updateTable()
          })
        },
        cancelText: '取消'
      })
    },
    handleItemAdd(str) {
      ApiQuestion.createItem({
        aid: this.aid,
        question: str
      }).then(
        (res) => {
          this.$Message.success('【创建成功】<br>ID_Question:' + res.data.data.id + '<br>Question:' + res.data.data.question)
          this.updateTable()
          this.adding.show = false
          this.adding.content = ''
        }
      )
    },
    handleItemChange(row) {
      Object.assign(this.editing, row)
    },
    handleItemCancel() {
      this.editing = {
        id: null,
        question: ''
      }
    },
    handleItemSave() {
      ApiQuestion.updateItem({
        question: this.editing.question,
        id: this.editing.id
      }).then(
        () => {
          this.updateTable()
          this.handleItemCancel()
        }
      )
    },
  }
};
</script>
