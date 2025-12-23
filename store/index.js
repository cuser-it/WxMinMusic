//在这个JS文件中，专门用来创建 Store 的实例对象
import {
  action,
  observable
} from 'mobx-miniprogram'

export const store = observable({
  numA: 1,
  numB: 2,
  // 计算属性
  get sum() {
    return this.numA + this.numB
  },
  // actions 方式，用来修改store中的数据
  updateNum1: action(function (step) {
    this.numA += step
  }),
  updateNum2: action(function (step) {
    this.numB += step
  }),

})