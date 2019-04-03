<template>
  <div>
    <div style="margin-bottom: 20px;">
      <Row style="margin-top: 20px;">
        <Col :md=18 :xs=24>
        <Input v-model="search_value" search enter-button placeholder="请输入需要查找的字符..." @on-search="handleResetUpdateTable" @on-change="handleResetUpdateTable"/>
        </Col>
        <Col v-if="show_part.adding" :md="{span:5, offset:1}" :xs=24 >
        <Button type="dashed" icon="md-add" long @click="adding.show = true">新建{{ meta.name }}</Button>
        </Col>
      </Row>
      <component :is="modal_options.instance" v-bind="modal_options.data" v-on="modal_options.events"></component>
    </div>
    <Table :columns="columns" :data="data" :loading="loading" :highlight-row="table.selectable" stripe border v-on="table.events" />
    <Page :total="pagination.total" :current="pagination.page" :page-size="pagination.limit" style="margin-top: 25px;" @on-change="handlePageChange"></Page>
    <component v-for="item in Object.entries(extra_components)" :key="item[0]" :is="item[1].instance" v-bind="item[1].props" v-on="item[1].events"></component>
  </div>
</template>

<script>
import SimpleModal from '@/components/modal/SimpleItemAdd.vue'
export default {
  data() {
    return {
      data: [],
      columns: [],
      meta: {},
      loading: true,
      search_value: '',
      adding: {
        show: false,
        content: ''
      },
      pagination: {
        limit: null,
        total: null,
        page: 1
      },
      table: {
        selectable: false,
        events: {
          'on-current-change': () => {}
        }
      },
      extra_components: {},
      show_part: {
        adding: true
      },
      default_add_item_modal: SimpleModal
    }
  },
  computed: {
    subject() {
      return this.$store.state.subject_selected
    },
    update_table_obj() {
      return {
        params: {
          sid: this.subject.id,
          search: this.search_value,
          page: this.pagination.page ? this.pagination.page - 1 : null,
          limit: this.pagination.limit
        },
        url: '',
        data: {
        },
        res_data_arr: 'list'
      }
    },
    modal_options() {
      return {
        instance: this.default_add_item_modal,
        data: {
          adding: this.adding,
          subject: this.subject,
          meta: this.meta
        },
        events: {
          'on-add': str => {
            this.handleItemAdd(str)
          },
          'show-change': value => {
            Object.assign(this.adding, {
              show: value,
              content: ''
            })
          }
        }
      }
    }
  },
  watch: {
    'subject.id': {
      handler() { this.updateTable() },
      immediate: true
    }
  },
  methods: {
    updateTable() {
      this.selfUpdateTable().then(
        data => {
          this.pagination.total = +data.total
          this.pagination.page = +data.page + 1
          this.pagination.limit = +data.limit
        }
      )
    },
    selfUpdateTable() {},
    handleItemAdd() {},
    handlePageChange(page) {
      this.pagination.page = page
      this.updateTable()
    },
    handleResetUpdateTable() {
      this.pagination.page = null
      this.updateTable()
    },
    resetAll() {
      Object.assign(this.pagination, {
        page: 1
      })
      Object.assign(this.$data, {
        adding: {
          show: false,
          content: ''
        },
        search_value: ''
      })
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>
