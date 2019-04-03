<template>
  <Modal v-model="adding.show">
    <p slot="header" style="text-align: center">
      <Icon type="ios-information-circle"></Icon>
      <span>【科目：{{ subject.name }}】新建{{ meta.name }}</span>
    </p>
    <div>
      <span style="font-weight: bold; font-size: 15px;">请输入{{ meta.name }}：</span>
      <Input v-model="adding.content" type="textarea" style="margin-top: 10px;" @keyup.enter.native="handleItemAdd"></Input>
    </div>
    <div slot="footer">
      <Button type="success" icon="md-add" long @click.prevent="handleItemAdd">新建</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    adding: {
      type: Object,
      default: () => ({
        adding: false,
        content: ''
      })
    },
    subject: {
      type: Object,
      default: () => ({
        name: null
      })
    },
    meta: {
      type: Object,
      default: () => ({
        name: null
      })
    }
  },
  watch: {
    'adding.show'(nVal) {
      this.$emit('show-change', nVal)
    }
  },
  methods: {
    handleItemAdd() {
      if (this.adding.content.length === 0) {
        this.$Message.error(`${this.meta.name}不能为空`)
        return false;
      }
      this.$emit('on-add', this.adding.content)
    }
  },
}
</script>
