<script>
  import { h } from 'vue'
  import * as ElementPlusIcons from '@element-plus/icons-vue'

  export default {
    name: 'ClassIcon',
    props: {
      icon: String,
      color: String,
      size: String
    },
    render () {
      // 传入的 icon 是 el-icon-setting，这里将其转成 Setting 标签名
      const nameList = this.icon.split('-').pop().split('')
      nameList[0] = nameList[0].toUpperCase()
      const name = nameList.join('')
      // 拿到图标对象
      const icon = ElementPlusIcons[name]

      /**
       * template 中是 <el-icon> 标签包裹 <Setting> 标签
       * 打开控制台发现 el-icon 标签会被编译为 i 标签加上 class，所以这里用 i 标签
       * 且 el-icon 的 color 和 size 属性是被加到 i 标签的 style 属性中的，所以下面加了 class 与 style 属性
       */
      return h('i', {
        class: `el-icon ${this.icon}`,
        style: `font-size: ${this.size}px; color: ${this.color};`
      }, [
        icon.render()  // 调用图标对象的 render 方法转成 vnode
      ])
    }
  }
</script>
