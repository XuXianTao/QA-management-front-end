<template>
  <div style="display: inline-block; width: auto">
    <span class="label">{{ label }}</span>
    <Select v-model="subject_selected.id" class="input" style="width: auto">
      <Option v-for="item in subjects" :value="item.id" :key="item.id">
        {{ item.name }}
      </Option>
    </Select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: '选择显示科目：'
    }
  },
  data() {
    return {
    }
  },
  computed: mapState([
    'subjects',
    'subject_selected'
  ]),
  watch: {
    'subject_selected.id': {
      handler(nVal) {
        this.$store.commit('setSubjectSelected', {
          id: nVal,
          name: (val => this.subjects.find(item => item.id === val))(nVal).name
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus">
.label
  font-size 15px
  font-weight bold
</style>
