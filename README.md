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

### <keep-alive>
```
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

### 访问父级组件实例
$parent 属性可以用来从一个子组件访问父组件的实例

### transition 单元素/组件的过渡

在下列情形中，可以给任何元素和组件添加进入/离开过渡
* 条件渲染(使用v-if)
* 条件展示(使用v-show)
* 动态组件
* 组件根节点
