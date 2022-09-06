import { computed, defineComponent, unref } from "vue";
import { createFromIconfontCN } from '@ant-design/icons-vue'

let scriptUrls = ['/iconfont.js']

// scriptUrls: []
let MyIconFont = createFromIconfontCN({
  scriptUrl: scriptUrls
})

export default defineComponent({
  name: 'IconFont',
  props: {
    type: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: 'icon-'
    },
    color: {
      type: String,
      default: 'unset',
    },
    size: {
      type: [Number, String],
      default: 14
    },
    scriptUrl: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs}) {
    if(props.scriptUrl) {
      scriptUrls = [...new Set(scriptUrls.concat(props.scriptUrl))]
      MyIconFont = createFromIconfontCN({
        scriptUrl: scriptUrls
      })
    }

    const wrapStyleRef = computed(() => {
      const { color, size} = props
      const fs = isString(size) ? parseFloat(size) : size

      return {
        color,
        fontSize: `${fs}px`
      }
    })

    return () => {
      const { type, prefix} = props

      return (
        <MyIconFont
        type={type.startsWith(prefix) ? type : `${prefix}${type}`}
        {...attrs}
        style={unref(wrapStyleRef)}
        />
      )
    }
  }
})
