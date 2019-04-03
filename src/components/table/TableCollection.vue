<script>
// import Vue from 'vue'
import baseTable from './_TableBase.vue'
import DrawerList from '@/components/drawer/DrawerList.vue'

import {
  updateTable as libUpdateTable
} from '@/libs'
import {
  collection as ApiCollection
} from '@/apis'


export default {
  // functional: true,
  components: { baseTable, DrawerList },
  extends: baseTable,
  data() {
    return {
      meta: {
        name: '答案'
      },
      aid_show: null,
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
                      this.aid_show = params.row.id
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      extra_components: {
        DrawerList: {
          instance: DrawerList,
          props: {
            that: this,
            get aid() { return this.that.aid_show }
          },
          events: {
            'change-show': this.handleChangeDrawerShow
          }
        }
      }
    }
  },
  methods: {
    selfUpdateTable() {
      return libUpdateTable(this, Object.assign(this.update_table_obj, {
        url: ApiCollection.url.collection,
        data: {
          id: "id",
          question: "title",
          answer: "answer"
        },
      }));
    },
    handleChangeDrawerShow(is_shown) {
      this.aid_show = is_shown?this.aid_show:null
    },
    handleItemAdd(str) {
      ApiCollection.createItem({
        answer: str,
        sid: this.subject.id
      }).then(
        res => {
          this.$Message.success('答案新建成功')
          this.aid_show = +res.data.data.id
          this.adding.show = false
          this.updateTable()
        }
      )
    }
  }
}
</script>
