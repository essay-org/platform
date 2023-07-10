import QueryForm from './QueryForm.vue'

// app.use(QueryForm) 来使用
// Vue 的插件都需要暴露出 install 方法，接受一个 Vue 实例参数 app
QueryForm.install = app => {
  app.component(QueryForm.name, QueryForm)
}

export default QueryForm
