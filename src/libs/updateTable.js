import api from '@/apis/_base'
import { getNestVal } from './lib.js'
/**
* 
* @param Vue vue 
* @param {params, url, data} obj 
* example 
* {
*   params:{
*   }, 
*   url: 'http://', 
*   data: {
*     Table_a: 'Api_b', 
*     Table_c: {
*       name: 'Api_d',
*       map: {
*         value1: 'value1_show',
*         value2: 'value2_show'
*       }
*   }},
*   data_src: Object, 需要修改的数据对象，默认为vue自身的数据this.data
*   res_data_arr: '', 表格获取到的数据的数组，默认是body中的data字段
*/
export default (vue, obj, hook_success = null) => {
  return api('get', obj.url, obj.params).then(
    res => {
      let data = obj.res_data_arr ? res.data.data[obj.res_data_arr] : res.data.data;
      let result = [];
      data.forEach(el => {
        result.push((() => {
          let result_item = {};
          for (let [index, value] of Object.entries(obj.data)) {
            result_item[index] = (() => {
              let name = typeof value === 'object' ? value.name : value
              let result = getNestVal(el, name)
              return value.map ? value.map[result] : result;
            })()
          }
          return result_item
        })())
      });

      let data_src = obj.data_src ? obj.data_src : vue;
      Object.assign(data_src, {
        data: result,
        loading: false
      })
      if (hook_success) {
        hook_success(res.data.data)
      }
      return res.data.data
    },
    res => {
      vue.$Message.error('(' + res.status + ')' + res.statusText)
    }
  )
}