import {
  collection as ApiCollection,
  answer as ApiAnswer
} from '@/apis'
import {
  updateTable as libUpdateTable
} from '@/libs'

export default (vue) => ({
  data() {
    return {
      name: '答案系列',
      api: Object.assign({getAll: ApiAnswer.getAll}, ApiCollection),
      columns: [
        {
          title: "ID_ANSWER",
          key: "id"
        },
        {
          title: "问题",
          key: "question"
        },
        {
          title: "答案",
          key: "answer"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      vue.aid_show = params.row.id
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      is_adding_answer: false,
    }
  },
  methods: {
    updateTable() {
      return libUpdateTable(this, {
        params: {
          sid: this.subject.id,
          search: this.search_value,
          page: this.data_page ? this.data_page - 1 : null,
          limit: this.data_limit
        },
        url: ApiCollection.url.collection,
        data: {
          id: "id",
          question: "title",
          answer: "answer"
        },
        res_data_arr: 'list'
      }, (data) => {
        this.data_total = +data.total
        this.data_page = +data.page + 1
        this.data_limit = +data.limit
      });
    },
    handleChangeDrawerShow(is_shown) {
      this.aid_show = is_shown?this.aid_show:null
    },
    handlePageChange(page) {
      this.data_page = page
      this.updateTable()
    },
    handleResetUpdateTable() {
      this.data_page = null
      this.updateTable()
    },
    handleAnswerAdd() {
      if (this.adding_answer.length === 0) {
        this.$Message.error('答案不能为空')
        return false;
      }
      else {
        this.meta.api.createItem({
          answer: this.adding_answer,
          sid: this.subject.id
        }).then(
          res => {
            this.$Message.success('答案新建成功')
            this.aid_show = +res.data.data.id
            this.is_adding_answer = false
            this.updateTable()
          }
        )
      }
    }
  }
})