<template>
  <div class="leave-manager">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState" placeholder="请选择审批状态">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns" :key="item.prop"
          :prop="item.prop" :label="item.label" :width="item.width" :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
            <el-button v-if="scope.row.applyState <= 2" type="danger" size="small" @click="handleDelete(scope.row._id)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination" background layout="prev, pager, next"
        :total="pager.total" :page-size="pager.pageSize"
        @update:current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime" type="date" placeholder="选择开始日期"
                  @change="handleDateChange('startTime')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center;">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="leaveForm.endTime" type="date" placeholder="选择结束日期"
                  @change="handleDateChange('endTime')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime">{{ leaveForm.leaveTime }}</el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input type="textarea" :row="3" placeholder="请输入休假原因" v-model="leaveForm.reasons" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-steps :active="detail.applyState > 2 ? 3 : detail.applyState" align-center>
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
  import util from '@/utils/util'

  export default {
    name: 'Leave',
    setup () {
      const { ctx, appContext } = getCurrentInstance()
      const { $api, $message } = appContext.config.globalProperties
      const queryForm = reactive({
        applyState: ''
      })
      const columns = [{
        label: '单号',
        prop: 'orderNo'
      }, {
        label: '休假时间',
        prop: '',
        formatter (row) {
          return `${util.formateDate(new Date(row.startTime), 'yyyy-MM-dd')} - ${util.formateDate(new Date(row.endTime), 'yyyy-MM-dd')}`
        }
      }, {
        label: '休假时长',
        prop: 'leaveTime'
      }, {
        label: '休假类型',
        prop: 'applyType',
        formatter (row, column, value) {
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value]
        }
      }, {
        label: '休假原因',
        prop: 'reasons'
      }, {
        label: '申请时间',
        prop: 'createTime',
        formatter (row, column, value) {
          return util.formateDate(new Date(value))
        }
      }, {
        label: '审批人',
        prop: 'auditUsers'
      }, {
        label: '当前审批人',
        prop: 'curAuditUserName'
      }, {
        label: '审批状态',
        prop: 'applyState',
        formatter (row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value]
        }
      }]
      const applyList = ref([])
      const pager = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0
      })
      const rules = {
        startTime: [{ required: true, type: 'date', message: '请输入开始日期', trigger: 'change' }],
        endTime: [{ required: true, type: 'date', message: '请输入结束日期', trigger: 'change' }],
        reasons: [{ required: true, message: '请输入休假原因', trigger: ['blur', 'change'] }],
      }
      const showModal = ref(false)
      const leaveForm = reactive({
        applyType: 1,
        startTime: '',
        endTime: '',
        leaveTime: '0天',
        reasons: ''
      })
      const action = ref('add')

      onMounted(() => {
        getApplyList()
      })

      // 加载申请列表
      const getApplyList = async () => {
        const params = { ...queryForm, ...pager }
        const { list, page } = await $api.getApplyList(params)
        applyList.value = list
        pager.total = page.total
      }

      // 重置表单
      const handleReset = form => {
        ctx.$refs[form].resetFields()
      }

      // 分页事件处理
      const handleCurrentChange = current => {
        pager.pageNum = current
        this.getLeaveList()
      }

      const handleApply = () => {
        showModal.value = true
        action.value = 'add'
      }

      const handleClose = () => {
        showModal.value = false
        handleReset('dialogForm')
      }

      const handleSubmit = () => {
        ctx.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              const params = { ...leaveForm, action: action.value }
              await $api.leaveSubmit(params)
              $message.success('操作成功')
              handleClose('dialogForm')
              getApplyList()
            } catch (error) {
              $message.error('操作失败')
            }
          }
        })
      }

      const handleDateChange = (key) => {
        const { startTime, endTime } = leaveForm
        if (!startTime || !endTime) return  // 只要一个字段为空就不做处理
        if (startTime > endTime) {
          $message.error('开始日期不能晚于结束日期')
          leaveForm.leaveTime = '0天'
          setTimeout(() => {
            leaveForm[key] = ''
          })
        } else {
          leaveForm.leaveTime = `${(endTime - startTime) / (24 * 60 * 60 * 1000) + 1}天`
        }
      }

      const showDetailModal = ref(false)
      const detail = ref({})

      const handleDetail = row => {
        const data = { ...row }
        data.applyTypeName = {
          1: '事假',
          2: '调休',
          3: '年假'
        }[data.applyType]
        data.time = `${util.formateDate(new Date(data.startTime), 'yyyy-MM-dd')} 到 ${util.formateDate(new Date(data.endTime), 'yyyy-MM-dd')}`
        data.applyStateName = {
          1: '待审批',
          2: '审批中',
          3: '审批拒绝',
          4: '审批通过',
          5: '作废'
        }[data.applyState]
        detail.value = data
        showDetailModal.value = true
      }
      const handleDelete = async _id => {
        try {
          await $api.leaveSubmit({ _id, action: 'delete' })
          $message.success('作废成功')
          getApplyList()
        } catch (error) {
          $message.error(`作废失败：${error.stack}`)
        }
      }

      return {
        queryForm,
        columns,
        applyList,
        pager,
        handleReset,
        handleCurrentChange,
        getApplyList,
        rules,
        showModal,
        leaveForm,
        handleApply,
        handleClose,
        handleSubmit,
        handleDateChange,
        showDetailModal,
        detail,
        handleDetail,
        handleDelete
      }
    }
  }
</script>

<style lang="less">
  .leave-manager {
    .base-table {
      .pagination {
        padding: 20px 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
