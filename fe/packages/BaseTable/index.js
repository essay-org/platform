import BaseTable from './BaseTable.vue'

BaseTable.install = app => {
  app.component(BaseTable.name, BaseTable)
}

export default BaseTable
