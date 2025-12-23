/**
 * 向数组添加唯一项
 * @param {Array} array 目标数组
 * @param {any} item 要添加的项
 * @return {Array} 更新后的数组，如果项已存在则不添加
 */
function addUniqueItemToArray(array, item) {
  if (!array.includes(item)) {
    array.unshift(item);
  }
  return array;
}

module.exports = {
  addUniqueItemToArray,
};