<template>
  <Drawer
    v-model="is_show"
    class="drawer"
    title="编辑问答数据"
  >
    <div class="item">
      <span class="label">ID_ANSWER(答案ID): </span>
      <Input v-model="id" type="text" style="width: 50px; margin-left: 20px;" disabled />
    </div>
    <TableQuestion ref="Table" :aid="id" class="item"/>
    <div class="item">
      <span class="label">该系列问题答案: </span>
      <div v-if="is_answer_editing" class="answer">
        <Input v-model="answer_editing" :autosize="true" class="input" type="textarea" @on-keyup.enter="handleAnswerSave" @on-keyup.esc="is_answer_editing = false" />
        <Button type="primary" style="margin: 10px 0 0;" @click="handleAnswerSave">保存</Button>
        <Button icon="md-close" style="margin: 10px 0 0 10px;" @click="is_answer_editing = false"></Button>
      </div>
      <div v-else class="answer">
        <span class="text">{{ answer }}</span>
        <Icon class="icon" type="md-brush" size="15" @click="is_answer_editing = true; answer_editing = answer"/>
      </div>
    </div>
    <div class="item">
      <Alert type="warning" show-icon>
        请注意，删除该系列问题回答
        <span slot="desc">
          意味着将该系列下的所有问题都一并删除，请谨慎操作！！！！
        </span>
      </Alert>
      <Button type="error" long @click="handleAnswerDelete">删除</Button>
    </div>
  </Drawer>
</template>

<script>
import {
  collection as ApiCollection,
  answer as ApiAnswer
} from '@/apis'
import TableQuestion from '@/components/table/TableQuestion.vue'
import '@/stylus/drawer.styl'
export default {
  components: {TableQuestion},
  props: {
    aid: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      id: null,
      answer: '',
      is_answer_editing: false,
      answer_editing: ''
    }
  },
  computed: {
    is_show: {
      get() {
        return this.aid > 0
      },
      set(v) {
        if (!v) this.$refs.Table.resetAll()
        this.$emit('change-show', v)
      }
    }
  },
  watch: {
    aid(nVal) {
      if (nVal) this.updateData()
    }
  },
  methods: {
    updateData() {
      ApiAnswer.getItem({
        id: this.aid
      }).then(
        res => {
          this.id = res.data.data.id,
          this.answer = res.data.data.answer
        }
      )
    },
    
    handleAnswerSave() {
      ApiCollection.updateItem({
        id: this.aid,
        answer: this.answer_editing
      }).then(
        () => {
          this.updateData()
          this.is_answer_editing = false
          this.$parent.updateTable()
        }
      )
    },
    handleAnswerDelete() {
      this.$Modal.confirm({
        title: '【注意】是否确认删除该答案系列',
        content: '是否删除该问答数据<br>ID:' + this.aid + '<br>Answer:' + this.answer,
        closable: true,
        okText: '删除',
        onOk: () => {
          ApiCollection.deleteItem({
            id: this.aid
          }).then(() => {
            this.$Message.success('【删除成功】')
            this.is_show = false
            this.$parent.updateTable()
          })
        },
        cancelText: '取消'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.drawer
  .item
    margin 20px 10px
    .label
      margin-bottom 10px
      vertical-align middle
      font-weight bold
      font-size 15px
    .answer
      display block
      vertical-align middle
      .text
        font-size 15px
        &+.icon
          margin-left 10px
</style>
