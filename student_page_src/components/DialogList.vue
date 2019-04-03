<template>
  <div>
    <DialogItem v-for="(item, key) in dialog_list" :key="key" v-bind="item"> {{ key }} </DialogItem>
  </div>
</template>


<script>
import DialogItem from '@stu/components/DialogItem.vue'
export default {
  components: {DialogItem},
  props: {
    dialog_list: {
      type: Array,
      default: () => {}
    }
  },
  watch: {
    dialog_list() {
    }
  }
}
</script>
