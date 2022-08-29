<template>
  <div>

  </div>
</template>

<script>
import { getMenuList, updateMenu, createMenu, deleteMenu } from '@/api/system/menu'
import { formatMenu2Tree} from '@/utils/index'
import { defineComponent, ref } from '@vue/runtime-core'
// import
export default defineComponent({
  setup() {
    const menuTree = ref([])
    const loadTableData = async () => {
      const data = await getMenuList()
      const filterData = JSON.parse(JSON.stringify(data)).filter(n => n.type !== 2)
      menuTree.value = formatMenu2Tree(filterData, null)

      return { list:  JSON.parse(JSON.stringify(data), null)}
    }

    const openMenuModal = async (record) => {
      const [formRef] = await showModal({
        modalProps: {
          title: record.id ? '编辑菜单' : '新增菜单',
          width: 700,
          onFinish: async (values) => {
            values.menuId = record.id
            values.perms = values.perms?.join(',')
            await (record.id ? updateMenu : createMenu)(values)
            dynamicTableInstance?.reload()
          }
        },
        formProps: {
          labelWidth: 100,
          schemas: menuSchemas
        }
      })
    }
  }
})
</script>

<style lang="less" scoped>

</style>
