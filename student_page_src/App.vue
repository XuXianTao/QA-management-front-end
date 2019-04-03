<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <Header/>
    <DialogList ref="list" :dialog_list="dialog_list" style="flex: 1; overflow: scroll; "/>
    <ChatInput @statu-change="scrollDialog" @send-msg="handleSendMsg"/>
  </div>
</template>

<script>
import Header from '@stu/components/Header.vue'
import DialogList from '@stu/components/DialogList.vue'
import ChatInput from '@stu/components/ChatInput.vue'

import {getAnswer} from '@stu/apis/auto_msg'

export default {
  components: { Header, DialogList, ChatInput },
  data() {
    return {
      dialog_list: [
        {
          msg: `本聊天室用于收集并为学生提供自动问答服务【由于初期数据量较少，可能无法获得理想答案】

提问之前请确认已生效的科目信息，通过发送

\`【查询】科目\`

来得到相应信息

提问方式为：

\`【科目】你的问题\`
* 如果需要记录发送者请按照如下格式发送
\`【科目】你的问题【发送者】XXX\`
          `,
          is_from_ai: true
        }
      ],
      chat_input: '',
      list_height: null
    }
  },
  watch: {
    dialog_list: {
      handler() { this.scrollDialog() }
    }
  },
  mounted() {
    window.onresize = this.scrollDialog
  },
  methods: {
    scrollDialog() {
      let list = this.$refs.list.$el
      const should_scroll = list.scrollHeight - list.clientHeight;
      list.scrollTop = should_scroll;
    },
    handleSendMsg(msg) {
      this.dialog_list.push({
        msg,
        is_from_ai: false
      })
      getAnswer(msg).then(
        res => {
          this.dialog_list.push({
            msg: res.data.data,
            is_from_ai: true
          })
        }
      )
      this.scrollDialog()
    }
  }
}
</script>
