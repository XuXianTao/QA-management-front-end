<template>
  <div>
    <div class="input-group">
      <SelectSubject />
    </div>
    <TableSubmission ref="table" @on-edit="handleDrawerChangeShow"/>
    <DrawerSubmission :sid="editing.id" @change-show="handleDrawerChangeShow" @change-item="handleDrawerItemChange"/>
  </div>
</template>

<script>
import SelectSubject from '@/components/SelectSubject'
import DrawerSubmission from '@/components/drawer/DrawerSubmission'
import TableSubmission from '@/components/table/TableSubmission'

export default {
  components: {
    SelectSubject,
    DrawerSubmission,
    TableSubmission
  },
  data() {
    return {
      editing: {
        id: null
      }
    }
  },
  methods: {
    handleDrawerChangeShow(v) {
      this.editing.id = v
    },
    handleDrawerItemChange() {
      this.$refs.table.updateTable()
    }
  }
}
</script>

<style lang="stylus" scoped>
.input-group
  text-align left
.table
  margin-top 20px
</style>
