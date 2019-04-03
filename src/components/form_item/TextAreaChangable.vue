<template>
  <div class="item">
    <span class="label"> {{ data.label }}: </span>
    <div v-if="data.is_editing" class="content">
      <Input v-model="data.editing" :autosize="true" class="input" type="textarea" @on-keyup.enter="handleSave" @on-keyup.esc="data.is_editing = false" />
      <Button type="primary" style="margin: 10px 0 0;" @click="handleSave">保存</Button>
      <Button icon="md-close" style="margin: 10px 0 0 10px;" @click="data.is_editing = false"></Button>
    </div>
    <div v-else class="content">
      <span class="text">{{ data.src }}</span>
      <Icon class="icon" type="md-brush" size="15" @click="data.is_editing = true; data.editing = data.src" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        label: '',
        is_editing: false,
        src: '',
        editing: ''
      })
    }
  },
  methods: {
    handleSave() {
      this.$emit('item-save', this.data)
    }
  }
}
</script>
