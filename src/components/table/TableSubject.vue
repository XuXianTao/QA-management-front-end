<script>
import baseTable from './_TableBase.vue'
import {updateTable as libUpdateTable} from '@/libs'
import {subject as ApiSubject} from '@/apis'
export default {
  extends: baseTable,
  data() {
    return {
      meta: {
        name: '科目'
      },
      columns: [
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '科目',
          key: 'title'
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'large'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.deleteItem(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
    }
  },
  methods: {
    selfUpdateTable() {
      return libUpdateTable(
        this,
        Object.assign(this.update_table_obj, {
          url: ApiSubject.url.subject,
          data: {
            id: 'id',
            title: 'name'
          },
          res_data_arr: 'list'
        }),
        (data) => {
          if (this.$store.state.user_type === 'admin') this.$store.commit('setSubjects', data)
        }
      )
    },
    deleteItem(item) {
      ApiSubject.deleteItem({
        id: item.id
      }).then(
        () => {
          this.$Message.success('删除科目【' + item.title + '】成功');
          this.updateTable();
          this.$store.commit('refreshSubjects')
        },
      )
    },
    handleItemAdd() {
      ApiSubject.createItem({
        title: this.adding.content
      }).then(
        res => {
          this.$Message.success('添加科目【' + res.data.data.name + '】成功')
          this.updateTable()
          this.$store.commit('refreshSubjects')
          this.adding.show = false
          this.adding.content = ''
        }
      )
    }
  }
}
</script>
