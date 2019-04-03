<template>
  <div class="chat-input">
    <textarea ref="input" v-model="msg" rows="1" @keyup.ctrl.enter="handleMsgSend"></textarea>
    <button @click="handleMsgSend">发送</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    const el_input = this.$refs.input;
    el_input.oninput = () => {
      el_input.style.height = 'auto'
      el_input.scrollTop = 0
      el_input.style.height = el_input.scrollHeight + 'px'
      this.$emit('statu-change')
    }
    // el_input.onfocus = () => setTimeout(() => this.$emit('statu-change'), 550)
    el_input.style.height = el_input.scrollHeight + 'px'
  },
  methods: {
    handleMsgSend() {
      const el_input = this.$refs.input;
      el_input.value = '';
      el_input.style.height = 'auto'
      this.$emit('send-msg', this.msg)
    }
  }
}
</script>

<style lang="stylus" scoped>
.chat-input
  $font-size = 1rem
  display flex
  min-height $font-size
  padding .5em
  background-color #f8f8f9
  border-top 1px solid #e8eaec
  font-size $font-size
  textarea
    box-sizing border-box
    resize none
    flex 4
    padding .5rem
    font-size $font-size
  button
    flex 1

</style>

