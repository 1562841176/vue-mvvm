# vue-mvvm [双向绑定原理](https://segmentfault.com/a/1190000006599500) 
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
#### 过渡的类名
v-enter：定义进入过渡的开始状态  
v-enter-active：定义进入过渡生效时的状态。   
v-enter-to: 2.1.8版及以上 定义进入过渡的结束状态。  
v-leave: 定义离开过渡的开始状态。  
v-leave-active：定义离开过渡生效时的状态。
v-leave-to: 2.1.8版及以上 定义离开过渡的结束状态。 

### <transition-group>

不仅可以进入动画和离开动画，还可以改变定位。要使用这个新功能只需增加v-move特性，它会在元素的改变定位过程中应用  

v-move 对于设置过渡的切换时机和过渡曲线是非常有用





