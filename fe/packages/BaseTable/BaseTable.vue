<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <!-- data、selection-change 等属性和事件都直接透传给 el-table -->
    <el-table v-bind="$attrs">
      <el-table-column type="selection" width="55" v-if="selection" />
      <template v-for="item in columns" :key="item.prop">
        <!-- label、prop、width、formatter 等都通过 v-bind="item" 赋值给 el-table-column -->
        <el-table-column v-if="!item.type" v-bind="item" />
        <el-table-column v-else-if="item.type === 'action'" v-bind="item">
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="btn.text">
              <el-button :type="btn.type || 'text'" size="small" @click="handleAction(index, scope.row)">{{ btn.text }}</el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination" background layout="prev, pager, next"
      :total="pager.total" :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'BaseTable',
    props: {
      columns: Array,
      selection: Boolean,
      pager: Object
    },
    setup (props, context) {
      const handleAction = (index, row) => {
        context.emit('handleAction', {
          index,
          row: {
            ...row  // 通过解构让 row 从响应式变为普通对象
          }
        })
      }

      const handleCurrentChange = pageNum => {
        context.emit('handleCurrentChange', pageNum)
      }

      return {
        handleAction,
        handleCurrentChange
      }
    }
  }
</script>
