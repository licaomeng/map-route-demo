const isEmptyObj = obj => obj !== void 0 && obj.constructor === Object && Object.entries(obj).length === 0
const isObj = obj => obj !== void 0 && obj.constructor === Object

export {
  isEmptyObj,
  isObj
}