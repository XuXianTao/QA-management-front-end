<script>
import baseTable from './_TableBase.vue'
import {
  updateTable as libUpdateTable
} from '@/libs'
import {
  answer as ApiAnswer
} from '@/apis'

export default {
  extends: baseTable,
  data() {
    return {
      meta: {
        name: '回答'
      },
      columns: [
        {
          title: 'ID_Answer',
          key: 'id',
          maxWidth: 150
        },
        {
          title: '回答',
          key: 'answer'
        }
      ],
      show_part: {
        adding: false
      },
      pagination: {
        limit: 6,
        total: null,
        page: 1
      },
      table: {
        selectable: true,
        events: {
          'on-current-change': currentRow => {
            this.$Modal.confirm({
              title: '确认操作',
              content: `是否确认要将该回答作为答案<br>ID_Answer: ${currentRow.id}<br>回答：${currentRow.answer}`,
              onOk: () => {
                this.$emit('choose-item', currentRow)
              }
            })
          }
        }
      },
    }
  },
  methods: {
    selfUpdateTable() {
      return libUpdateTable(this, Object.assign(this.update_table_obj, {
        url: ApiAnswer.url.answer,
        data: {
          id: 'id',
          answer: 'answer'
        },
      }))
    }
  }
}
</script>
