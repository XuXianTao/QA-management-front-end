const libs = {
  getNestVal(obj, index_str, newVal = null) {
    let values_index = index_str.match(/[^+.]+(?=\.|$)/g);
    let result = obj;
    for (let item of values_index) {
      if (!result || result[item] === null) return null
      result = result[item]
    }
    if (newVal !== null) {
      if (newVal instanceof Array) {
        newVal.forEach(item => result.push(item))
      }
      else {
        result = newVal
      }
    }
    return result
  },
  getMessage(res, str) {
    let body = res.body
    let str_rep = []
    str.match(/{(\S+)}/g).forEach(item => {
      let index = item.match(/[^{}]+/g)[0]
      str_rep.push(this.getNestVal(body, index))
    })
    let count = 0;
    let result = str.replace(/{(\S+)}/, str_rep[count++])
    while (/{(\S+)}/.test(result) && count < str_rep.length) {
      result = result.replace(/{(\S+)}/, str_rep[count++])
    }
    return result
  }
}
for (let [index, value] of Object.entries(libs)) {
  exports[index] = value
}
export default libs