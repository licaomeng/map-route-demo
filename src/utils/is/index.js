const isEmptyObj = obj => obj.constructor === Object && Object.entries(obj).length === 0

export {
  isEmptyObj
}