// 树的递归
// 首先我们来实现树的递归算法，在实现该算法前，先来考虑下两个节点对比会有几种情况

// 1.新的节点的 tagName 或者 key 和旧的不同，这种情况代表需要替换旧的节点，并且也不再需要遍历新旧节点的子元素了，因为整个旧节点都被删掉了
// 2.新的节点的 tagName 和 key（可能都没有）和旧的相同，开始遍历子树
// 3.没有新的节点，那么什么都不用做
function diff(oldDomTree, newDomTree) {
    let pathchs = {}; //用于记录差异
    dfs(oldDomTree, newDomTree, 0, pathchs); // 一开始的索引为0
    return pathchs;
}

function dfs(oldNode, newNode, index, pathchs) {
    let curPatches = [];
    // 需要判断三种情况
    // 1.没有新的节点，那么什么都不用做
    // 2.新的节点的 tagName 和 `key` 和旧的不同，就替换
    // 3.新的节点的 tagName 和 key（可能都没有） 和旧的相同，开始遍历子树

    if (!newNode) {} else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
        // 判断属性是否变更
        let props = diffProps(oldNode.props, newNode.props);
        if (props.length) {
            curPatches.push({
                type: stateEnums.ChangeProps,
                props
            })
        }
        // 遍历子树
        diffChildren(oldNode.children, newNode.children, index, pathchs)
    } else {
        // 节点不同，需要替换
        curPatches.push({
            type: stateEnums.Replace,
            node: newNode
        })
    }


    if (curPatches.length) {
        if (pathchs[index]) {
            pathchs[index] = pathchs[index].concat(curPatches)
        } else {
            pathchs[index] = curPatches;
        }
    }
}

// 判断属性的更改
// 判断属性的更改也分三个步骤

// 1.遍历旧的属性列表，查看每个属性是否还存在于新的属性列表中
// 2.遍历新的属性列表，判断两个列表中都存在的属性的值是否有变化
// 3.在第二步中同时查看是否有属性不存在与旧的属性列列表中

function diffProps(oldProps, newProps) {
    // 判断 Props 分以下三步骤
    // 先遍历 oldProps 查看是否存在删除的属性
    // 然后遍历 newProps 查看是否有属性值被修改
    // 最后查看是否有属性新增

    let change = [];
    for (const key in oldProps) {
        if (oldProps.hasOwnProperty(key) && !newProps[key]) {
            change.push({
                prop: key
            })
        }
    }

    for (const key in newProps) {
        if (newProps.hasOwnProperty(key)) {
            const prop = newProps[key];
            if (oldProps[key] && oldProps[key] !== newProps[key]) {
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            } else if (!oldProps[key]) {
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            }
        }
    }
    return change;
}


// 判断列表差异算法实现
// 这个算法是整个 Virtual Dom 中最核心的算法，且让我一一为你道来。 这里的主要步骤其实和判断属性差异是类似的，也是分为三步

// 1.遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
// 2.遍历新的节点列表，判断是否有新的节点
// 3.在第二步中同时判断节点是否有移动
function listDiff(oldList, newList, index, patches) {
    let oldkeys = getKeys(oldList);
    let newKeys = getKeys(newList);
    let changes = [];


    // 用于保存变更后的节点数据
    // 使用该数组保存有以下好处
    // 1.可以正确获得被删除节点索引
    // 2.交换节点位置只需要操作一遍 DOM
    // 3.用于 `diffChildren` 函数中的判断，只需要遍历
    // 两个树中都存在的节点，而对于新增或者删除的节点来说，完全没必要
    // 再去判断一遍
    let list=[];
    oldList && oldList.forEach(item=>{
        let key =item.key;
        if(isString(item)){
            key = item
        }
        // 寻找新的 children 中是否含有当前节点
        // 没有的话需要删除
        let index =newKeys.indexOf(key);
        if(index===-1){
            list.push(null); 
        }else{
            list.push(key);
        }
    })
    // 遍历变更后的数组
    let length=list.length;
    // 因为删除数组元素是会更改索引的
    // 所有从后往前删可以保证索引不变
    for(let i=length-1;i>=0;i--){
        // 判断当前元素是否为空，为空表示需要删除
        if(!list[i]){
           list.splice(i,1)
           changes.push({
               type:stateEnums.Remove,
               index:i
           }) 
        }
    }

    // 遍历新的 list，判断是否有节点新增或移动
    // 同时也对 `list` 做节点新增和移动节点的操作

    newList && newList.forEach((item,i)=>{
        let key=item.key
        if(isString(item)){
            key=item
        }
        // 寻找旧的 children 中是否含有当前节点
        let index = list.indexOf(key);
        // 没找到代表新节点，需要插入
        if(index===-1 || key==null){
            changes.push({
                type:stateEnums.Insert,
                node:item,
                index:i
            })
        }else{
            // 找到了，需要判断是否需要移动 
            if(index!==1){
                changes.push({
                    type: StateEnums.Move,
                    from: index,
                    to: i
                  })
                  move(list, index, i)
            }
        }
    })
    return {changes,list}
}

function getKeys(list) {
    let keys = [];
    let text
    list && list.forEach(item => {
        let key
        if (isString(item)) {
            key = [item]
        } else if (item instanceof Element) {
            key = item.key
        }
        keys.push(key)
    });
    return keys;
}

// 遍历子元素打标识
// 对于这个函数来说，主要功能就两个

// 判断两个列表差异
// 给节点打上标记
function diffChildren(oldChild, newChild, index, patches) {
    let { changes, list } = listDiff(oldChild, newChild, index, patches)
    if (changes.length) {
      if (patches[index]) {
        patches[index] = patches[index].concat(changes)
      } else {
        patches[index] = changes
      }
    }
    // 记录上一个遍历过的节点
    let last = null
    oldChild &&
      oldChild.forEach((item, i) => {
        let child = item && item.children
        if (child) {
          index =
            last && last.children ? index + last.children.length + 1 : index + 1
          let keyIndex = list.indexOf(item.key)
          let node = newChild[keyIndex]
          // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
          if (node) {
            dfs(item, node, index, patches)
          }
        } else index += 1
        last = item
      })
  }