// 渲染差异
// 通过之前的算法，我们已经可以得出两个树的差异了。既然知道了差异，就需要局部去更新 DOM 了，下面就让我们来看看 Virtual Dom 算法的最后一步骤

// 这个函数主要两个功能

// 深度遍历树，将需要做变更操作的取出来
// 局部更新 DOM

let index = 0;

function patch(node, patchs) {
    let changes = patchs[index];
    let childNodes = node && node.childNodes
    // 这里的深度遍历和 diff 中是一样的
    if (!childNodes) index += 1
    if (changes && changes.length && patchs[index]) {
        changeDom(node, changes)
    }

    let last = null

    if (childNodes && childNodes.length) {
        childNodes.forEach((item, i) => {
            index =
                last && last.children ? index + last.children.length + 1 : index + 1
            patch(item, patchs)
            last = item
        });
    }
}


function changeDom(node, changes, noChild) {
    changes && changes.forEach(change => {
        let {
            type
        } = change;
        switch (type) {
            case stateEnums.ChangeProps:
                let {
                    props
                } = change;
                props.forEach(item => {
                    if (item.value) {
                        node.setAttribute(item.prop, item.value)
                    } else {
                        node.removeAttribute(item.prop)
                    }
                })
                break;
            case stateEnums.ChangeText:
                break;
            case stateEnums.Remove:
                node.childNodes.splice(change.index).remove()
                break;
            case stateEnums.Insert:
                let dom;
                if (isString(change.node)) {
                    dom = document.createTextNode(change.node)
                } else if (change.node instanceof Element) {
                    dom = change.node.create()
                }
                break;
            case stateEnums.Replace:
                node.parentNode.replaceChild(change.node.create(), node)
                break;
            case stateEnums.Move:
                let fromNode = node.childNodes[change.from]
                let toNode = node.childNodes[change.to]
                let cloneFromNode = fromNode.cloneNode(true)
                let cloenToNode = toNode.cloneNode(true)
                node.replaceChild(cloneFromNode, toNode)
                node.replaceChild(cloenToNode, fromNode)
                break
            default:
                break
        }
    })
}