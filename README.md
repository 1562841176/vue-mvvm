# vueProject
对vue的认识

Vue 不能检测对象属性的添加或删除
对已经创建的实例，Vue不能动态添加根级别的响应式属性。但是，可以使用Vue.set(object,key,value)方法向嵌套对象添加响应式属性。


定义 `<button-counter>` 组件时，你可能会发现它的 data 并不是像这样直接提供一个对象：
```
data: {
  count: 0
}
```
取而代之的是：一个组件的data必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝：
```
data: function () {
  return {
    count: 0
  }
}
```