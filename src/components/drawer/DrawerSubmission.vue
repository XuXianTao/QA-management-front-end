<template>
  <Drawer 
    v-model="is_show"
    class="drawer"
    title="修改提交数据"
  >
    <div class="item">
      <span class="label">ID_Submission:</span>
      <Input v-model="sid" type="text" style="width: 50px; margin-left: 20px;" disabled/>
    </div>
    <TextItem :data="question" class="item" style="display: inline-block; width: 30%" @item-save="handleItemSave('question')"/>
    <TextItem :data="submitter" class="item" style="display: inline-block; width: 30%" @item-save="handleItemSave('submitter')"/>
    <div class="item">
      <span class="label">回答：</span>
      <Input v-model="answer.src" style="width: auto" disabled/>
      <span v-if="answer.src">&nbsp;&nbsp;[ID_Answer: {{ answer.id }}]</span>
    </div>
    <div class="item">
      <Button type="primary" class="button" @click="answer.is_editing = true">修改并新建一个回答</Button>
      <Button type="primary" class="button" @click="answer.is_selecting = true">从已有回答中选择</Button>
    </div>
    <div class="item">
      <TableAnswer v-if="answer.is_selecting" @choose-item="handleAnswerSelect"/>
      <TextItem v-if="answer.is_editing" :data="answer" @item-save="handleAnswerSave"/>
    </div>
  </Drawer>
</template>

<script>
import TextItem from '@/components/form_item/TextAreaChangable.vue'
import TableAnswer from '@/components/table/TableAnswer.vue'
import {
  submission as ApiSubmission,
  answer as ApiAnswer
} from '@/apis'
import '@/stylus/drawer.styl'
export default {
  components: {
    TextItem,
    TableAnswer
  },
  props: {
    sid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      question: {
        label: '问题',
        is_editing: false,
        src: '',
        editing: ''
      },
      submitter: {
        label: '提交者',
        is_editing: false,
        src: '',
        editing: ''
      },
      answer: {
        id: null,
        label: '回答',
        is_editing: false,
        is_selecting: false,
        src: '',
        editing: ''
      }
    }
  },
  computed: {
    is_show: {
      get() {
        return this.sid !== null
      },
      set(v) {
        if (!v) {
          this.answer.is_editing = false
          this.answer.is_selecting = false
        }
        this.$emit('change-show', v ? this.sid : null)
      }
    },
    is_editing_answer() {
      return this.answer.is_selecting || this.answer.is_editing;
    }
  },
  watch: {
    sid(val) {
      if (val) {
        ApiSubmission.getItem({
          id: val
        }).then(
          res => {
            let data = res.data.data
            this.question.src = data.question
            this.submitter.src = data.submitter
            this.answer.id = data.aid
            if (data.answer) {
              this.answer.src = data.answer.answer
              this.answer.editing = data.answer.editing
            }
            else {
              this.answer.src = ''
              this.answer.editing = ''
            }
          }
        )
      }
    },
    'answer.is_editing'(nVal) {
      if (nVal) this.answer.is_selecting = false
    },
    'answer.is_selecting'(nVal) {
      if (nVal) this.answer.is_editing = false
    }
  },
  methods: {
    handleItemSave(type, other_params = {}) {
      const params = {id: this.sid};
      params[type] = this[type].editing
      Object.assign(params, other_params)
      return ApiSubmission.updateItem(params).then(
        res => {
          this.$Message.success('更新成功')
          Object.assign(this[type], {
            is_editing: false,
            src: res.data.data[type],
            editing: ''
          })
          this.$emit('change-item')
        }
      )
    },
    handleAnswerSave() {
      ApiAnswer.createItem({
        sid: this.$store.state.subject_selected.id,
        answer: this.answer.editing
      }).then(
        res => {
          this.handleItemSave('answer', { aid: res.data.data.id }).then(
            this.answer.id = res.data.data.id
          )
        }
      )
    },
    handleAnswerSelect(row) {
      this.handleItemSave('answer', { aid: row.id }).then(
        () => {
          Object.assign(this.answer, {
            src: row.answer,
            id: row.id
          })
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.drawer
  .item
    margin 20px 10px
    vertical-align: top
    .label
      margin-bottom 10px
      vertical-align middle
      font-weight bold
      font-size 15px
    .content
      display block
      vertical-align middle
      .text
        font-size 15px
        &+.icon
          margin-left 10px
    .button
      margin 5px 20px
</style>
