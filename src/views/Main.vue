<template>
  <div class="layout">
    <Layout>
      <Header class="top">
        <span style="font-size: 13px; color: #e8eaec">
          欢迎，{{ $store.state.account }}
          <Button type="dashed" style="margin-left: 20px; font-size: 13px; vertical-align: baseline; " ghost @click="pw_changing = true">修改密码</Button>
        </span>
        <div class="power">
          <Button type="text" icon="md-log-out" ghost @click="handleLogout">退出</Button>
          <img src="../assets/iviewicon.png" alt="iviewui">
          <img src="../assets/logo.png" alt="">
        </div>
      </Header>
      <Layout class="content">
        <Sider ref="side" :collapsed-width="78" :width="300" v-model="isCollapsed" class="sider" breakpoint="md" collapsible @mouseover.native="isCollapsed = false" @mouseout.native="isCollapsed = true">
          <Menu ref="side-group" :class="menuitemClasses" :active-name="getActiveItem" theme="dark" width="auto">
            <router-link v-for="item in menu" :key="item.title" :to="item.link">
              <MenuItem :name="item.link">
              <Icon :type="item.icon" />
              <span>{{ item.title }}</span>
              </MenuItem>
            </router-link>
          </Menu>
          <div slot="trigger"></div>
        </Sider>
        <Layout>
          <Content :style="{margin: '20px', minHeight: '260px'}">
            <div class="title">
              {{ getActiveTitle }}
            </div>
            <div class="line"></div>
            <router-view class="main"></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <Modal v-model="pw_changing"
           :loading="pw_changing_loading"
           title="修改密码"
           @on-ok="handleChangePassword"
           @on-cancel="resetModal"
    >
      <Form ref="modal_pw_change" :model="pw" :rules="pw.rules" :label-width=80>
        <FormItem prop="old" label="原密码">
          <Input v-model="pw.old" type="password" placeholder="请输入原密码..."></Input>
        </FormItem>
        <FormItem prop="new" label="新密码">
          <Input v-model="pw.new" type="password" placeholder="请输入新密码..."> </Input>
        </FormItem>
        <FormItem prop="confirm" label="再次输入">
          <Input v-model="pw.confirm" type="password" placeholder="请再次输入新密码..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {user as ApiUser} from '@/apis'
export default {
  data() {
    return {
      isCollapsed: true,
      menu: [],
      pw_changing: false,
      pw_changing_loading: true,
      pw: {
        old: null,
        new: null,
        confirm: null,
        rules: {
          old: { required: true, message: '原来的密码不能为空', trigger: 'blur'},
          new: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { min: 6, message: '新密码不能少于6位', trigger: 'blur'}
          ],
          confirm: [
            { required: true, message: '请输入新密码', trigger: 'blur'},
            { validator: (rule, value, callback) => {
              if (value !== this.pw.new) callback(new Error('与新密码不一致'))
              else callback()
            }, trigger: 'blur'}
          ]
        }
      }
    };
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    getActiveItem() {
      return this.$route.path.match(/[^/]+(?=\?\S+)*$/)[0];
    },
    getActiveTitle() {
      return this.menu.find(item => item.link === this.getActiveItem).title;
    }
  },
  created() {
    let user_type = this.$store.state.user_type
    const child_route = Object.create(this.$router.options.routes.find(item => item.path === '/main').children)
    child_route.shift()
    child_route.forEach(item => {
      if (item.meta.auth.indexOf(user_type) > -1)
        this.menu.push({
          title: item.name,
          icon: item.meta.icon,
          link: item.path,
        })
    })
  },
  methods: {
    collapsedSider() {
      this.$refs.side.toggleCollapse();
    },
    handleLogout() {
      ApiUser.logout().then(
        () => {
          this.$Message.success('已退出登录')
          this.$store.commit('setSubjects', [])
          this.$store.commit('logout')
          this.$router.push('/login')
        }
      )
    },
    handleChangePassword() {
      this.$refs.modal_pw_change.validate((valid) => {
        if (valid) {
          ApiUser.updateItem({
            id: this.$store.state.uid,
            password_old: this.md5(this.pw.old),
            password_new: this.md5(this.pw.new),
            type: 'change_pw'
          }).then(
            () => {
              this.$Message.success('密码修改成功')
              this.pw_changing = false
              this.resetModal()
            },
            () => {
              this.pw_changing_loading = false
              this.$nextTick(() => this.pw_changing_loading = true)
            }
          )
        }
        else {
          this.pw_changing_loading = false
          this.$nextTick(() => this.pw_changing_loading = true)
        }
      })
    },
    resetModal() {
      Object.assign(this.pw, {
        old: null,
        new: null,
        confirm: null
      })
    }
  }
};
</script>
<style lang="stylus">
@media screen and (max-width: 992px) 
  .sider
    position absolute
    height 100%
    .ivu-menu
      height 100%
</style>

<style lang="stylus" scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 169px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

$top-height = 50px;

.top
  top 0
  width 100%
  height $top-height
  line-height @height
  text-align left
  .title
    font-size: $top-height
    font-weight bold
    color #17233d
  .power
    display inline-block
    position absolute
    right 0
    line-height $top-height
    img
      height 30px
      padding-left 10px
      padding-right 10px
      vertical-align middle
      &:last-child
        border-left 1px solid hsla(0, 0, 100%, .3)

.content
  min-height "calc(100vh - %s)" % $top-height
  .sider
    border-top .5px solid hsla(0, 0, 100%, .3)
  .title
    padding 15px 20px
    border-left 3px solid #2c3e50
    vertical-align middle
    font-size 30px 
    text-align left
  .line
    border-left 3px solid transparent
    border-bottom 1px solid #e8eaec
    margin-top 5px
  .main
    margin 20px 0
</style>