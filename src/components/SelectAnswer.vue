<template>
  <Select :value="aidSelected" v-on="$listeners">
    <Option v-for="item in answers" :key="item.id" :value="item.id" class="select-item">
      {{ item.answer }}
    </Option>
  </Select>
</template>

<script>
import { answer as ApiAnswer} from '@/apis'
export default {
  props: {
    sid: {
      type: Number,
      default: null
    },
    aidSelected: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      answers: []
    }
  },
  created() {
    ApiAnswer.getAll({
      sid: this.sid
    }).then(
      res => {
        this.answers = res.data.data
      }
    )
  }
}
</script>

<style lang="stylus" scoped>
.select-item
  max-width 200px
  white-space normal
</style>
