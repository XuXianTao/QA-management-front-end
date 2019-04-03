<template>
  <div :class="['item', is_from_ai ? 'left':'right']">
    <!-- key: <slot> </slot>
    msg: {{ msg }}
    is_from_ai: {{ is_from_ai }} -->
    <div class="avatar"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    is_from_ai: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.item
  &:after
    display block
    content ' '
    clear both
  
  $avatar-size = 3rem
  $msg-color = #19be6b

  .avatar, .msg
    display block
    margin 1rem
  .avatar
    padding .3rem
    width $avatar-size
    height $avatar-size
    border .1rem inset gray 
    border-radius .2rem 
  .msg
    position relative
    padding 1rem
    max-width 50%
    border-radius .4rem
    background-color $msg-color
    white-space pre-line
    text-align left
  &.left
    text-align left
    .avatar, .msg
      float left
    .avatar
      background-image url('../../src/assets/logo.png')
      background-size cover
      background-origin content-box
      background-repeat no-repeat
    .msg
      &:before
        position absolute
        display block
        left 0
        top 0
        content ' '
        width 0
        height 0
        margin-left -1.4rem
        margin-top .5rem
        border-top .7rem solid transparent
        border-right 1.5rem solid $msg-color
        border-bottom .4rem solid transparent
  &.right
    text-align right
    .avatar, .msg
      float right
    .avatar
      text-align center
      &:before
        content: '?'
        font-size $avatar-size
        font-weight bolder
        line-height $avatar-size
    .msg
      &:after
        position absolute
        right 0
        top 0
        content ' '
        width 0
        height 0
        margin-right -1.4rem
        margin-top .5rem
        border-top .7rem solid transparent
        border-left 1.5rem solid $msg-color
        border-bottom .4rem solid transparent


</style>
