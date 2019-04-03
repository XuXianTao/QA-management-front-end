<template>
  <div class="list">
    <div class="inputs">
      <div class="item">
        <div style="display: inline-block; width: 100%;">
          <SelectSubject></SelectSubject>
          <div class="input" style="display: inline-block; position: relative; float: right; width: auto;">
            <Button :to="`${urls.output}?sid=${subject.id}`" target="_blank" icon="ios-cloud-download-outline" type="text">下载数据源【{{ subject.name }}】</Button>
            <Button icon="ios-cloud-upload-outline" type="primary" style="margin-right: 10px;" @click="modal_import = true">导入信息</Button>
            <Button icon="ios-ionitron-outline" type="warning" @click="handleDataTrain">训练数据</Button>
            <Modal v-model="modal_import" :transfer="false" title="导入csv表格信息" closable>
              <h1 style="padding-bottom: 10px">【科目】{{ subject.name }}</h1>
              <Upload
                :action="urls.import + '?sid=' + subject.id + '&from_id=' + ws.id"
                :format="['csv']"
                :on-format-error="handleImportFormatError"
                :before-upload="handleBeforeImport"
                :on-success="handleImportSuccess"
                :on-progress="handleImportProgress"
                :on-error="handleImportError"
                type="drag"
                accept=".csv"
                with-credentials
              >
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>拖拽或点击以导入文件</p>
              </Upload>
              <div slot="footer"></div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
    <TableCollection ref="TableCollection"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import SelectSubject from '@/components/SelectSubject.vue'
import TableCollection from '@/components/table/TableCollection.vue'

import {
  ws as Ws
} from '@/libs'
import {
  collection as ApiCollection,
  nlp as Nlp
} from '@/apis'

export default {
  components: { SelectSubject, TableCollection},
  data() {
    return {
      modal_import: false,
      urls: {
        output: ApiCollection.url.output,
        import: ApiCollection.url.import
      },
      ws: {
        id: null,
        percent: 0,
        instance: null,
        total: 0,
        finished: 0
      }
    };
  },
  computed: mapState({
    subject: state => state.subject_selected
  }),
  watch: {
    modal_import(nVal) {
      if (!nVal && this.ws.instance instanceof WebSocket) {
        this.ws.instance.close()
        this.$Spin.hide()
      }
      if (nVal) {
        this.ws.instance = Ws({
          percent: this.ws.percent,
          onOpen: ws => {
            ws.send('getID')
          },
          onMessage: (ws, ev) => {
            let data = JSON.parse(ev.data)
            if (data['id']) this.ws.id = data['id']
            if (data['finished'] && data['total']) {
              this.ws.finished = data['finished']
              this.ws.total = data['total']
              this.ws.percent = Math.round(data['finished'] * 100 / data['total'])
              if (this.ws.finished >= this.ws.total) {
                this.$nextTick(
                  () => {
                    this.$Spin.hide()
                    this.modal_import = false
                    this.ws.instance.close()
                    Object.assign(this.ws, {
                      id: null,
                      percent: 0,
                      instance: null,
                      total: 0,
                      finished: 0
                    })
                  }
                )
              }
            }
          },
          onError: () => {
            this.$Message.error('后台Websocket服务没有启动或出现问题<br>这将导致无法获取后台进度')
            this.$Spin.hide()
          }
        })
      }
    }
  },
  methods: {

    handleChangeDrawerShow(is_shown) {
      this.aid_show = is_shown?this.aid_show:null
    },
    handleImportFormatError() {
      this.$Message.error('【导入失败】请导入csv格式文件！')
    },
    handleBeforeImport() {
      if (this.sid_import === null) {
        this.$Message.error('请先选择导入的对应科目！！')
        return false
      }
    },
    handleImportProgress(ev) {
      // 上传成功之后
      if (ev.loaded === ev.total) {
        if (this.ws.instance instanceof WebSocket) {
          this.$Spin.show({
            render: h => h('div', [
              h('Progress', {
                props: {
                  percent: this.ws.percent,
                  'stroke-width': 20
                },
                style: {
                  width: '60vw'
                }
              }),
              h('div', {
                style: {
                  marginTop: '20px'
                }
              }, `后台处理文件中...`),
              h('div', `${this.ws.finished}/${this.ws.total}`)
            ])
          })
        }
      }
    },
    handleImportSuccess() {
      this.modal_import = false
      // TableCollection.updateTable()
      this.$refs.TableCollection.updateTable()
    },
    handleImportError(err) {
      this.$Message.error(`【导入失败】<br>Code:${err.status}<br>Message:${err.message}`)
    },
    handleDataTrain() {
      this.$Message.info('开始训练数据')
      this.$Spin.show({
        render: h => h('div', [
          h('Icon', {
            class: 'demo-spin-icon-load',
            props: {
              type: 'ios-loading',
              size: 18
            }
          }),
          h('div', `正在进行科目【${this.$store.state.subject_selected.name}】的数据训练`)
        ])
      })
      Nlp.datatrain({sid: this.$store.state.subject_selected.id}).then(
        () => {
          this.$Message.success('训练成功')
          this.$Spin.hide()
        },
        () => {
          this.$Message.error('训练出现问题，请联系管理员')
          this.$Spin.hide()
        }
      )
    }
  }
};
</script>

<style lang="stylus" scoped>
.list
  .inputs {
    display: block;
    text-align: left;

    .label {
      font-size: 15px;
      font-weight bold
    }

    .item {
      position relative
      margin 0 0 15px 0
    }
  }
</style>
<style>
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
</style>
