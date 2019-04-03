<template>
  <div class="top">
    <div class="title">AI智能回答</div>
    <div class="power">
      <img src="@/assets/iviewicon.png" alt="iviewui">
      <img src="@/assets/logo.png" alt="">
    </div>
  </div>
</template>

<style lang="stylus">
$top-height = 3rem;
$theme-color = #515a6e;

.top {
  top: 0;
  width: 100%;
  height: $top-height;
  background-color: $theme-color;
  line-height: @height;
  text-align: left;

  .title {
    display: inline-block;
    text-indent: 1rem;
    font-weight: bold;
    font-size: 1rem;
    color: #ffffff;
  }

  .power {
    display: inline-block;
    position: absolute;
    right: 0;
    line-height: $top-height;

    img {
      height: 30px;
      padding-left: 10px;
      padding-right: 10px;
      vertical-align: middle;

      &:last-child {
        border-left: 1px solid hsla(0, 0, 100%, 0.3);
      }
    }
  }
}
</style>
