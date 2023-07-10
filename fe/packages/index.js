import QueryForm from './QueryForm'
import BaseTable from './BaseTable'

export default {
  install (app) {
    app.use(QueryForm).use(BaseTable)
  }
}
