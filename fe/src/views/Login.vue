<template>
  <!-- 
    虽然 Vue3 支持在 template 中书写多个标签
    但还是建议用一个大的 div 包裹，这样用 less 写样式时可以把样式都写在大 div 的 class 下
    如此 style 就不用 scoped 属性了，使用 scoped 会生成很多的 attr 属性来区分样式，这样可以节省体积
   -->
   <div class="login-wrapper">
    <div class="modal">
      <!-- 
        model 定义表单作用域
        status-icon 作用是显示输入框的校验结果，具体可以看 input 框右侧小图标
        rules 用于自定义校验规则，需要 el-form-item 标签的 prop 属性配合
       -->
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">后台</div>
        <el-form-item prop="userName">
          <el-input type="text" prefix-icon="User" v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" prefix-icon="View" v-model="user.userPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
   </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    name: 'Login',
    data () {
      return {
        user: {
          userName: 'admin',
          userPwd: 'admin'
        },
        rules: {
          userName: [{
            // required 必填，message 错误提示，trigger 触发校验方式
            required: true, message: '请输入用户名', trigger: 'blur'
          }],
          userPwd: [{
            required: true, message: '请输入密码', trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      login () {
        // el-form 表单的 validate 是校验规则的方法，valid 参数为 true 表示校验通过
        this.$refs.userForm.validate(valid => {
          if (valid) {  // 校验通过
            this.$api.login(this.user).then(async res => {
              this.$store.commit('saveUserInfo', res)  // $store 是 vuex 自己挂载的
              await this.loadAsyncRoutes()
              this.$router.push('/welcome')
            })
          } else {
            return false  // 校验不通过，返回 false 不做任何事
          }
        })
      },
      async loadAsyncRoutes () {
        const userInfo = this.$store.state.userInfo
        if (userInfo.token) {
          try {
            const { menuList } = await this.$api.getPermissionList()
            const routes = util.generateRoute(menuList)
            routes.map(route => {
              const url = `./../views/${route.component}.vue`
              route.component = () => import(url)
              this.$router.addRoute('home', route)
            })
          } catch (error) {}
        }
      }
    }
  }
</script>

<style lang="less">
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
    width: 100vw;
    height: 100vh;
    .modal {
      width: 500px;
      padding: 50px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 10px 3px #c7c9cb4d;
      .title {
        font-size: 50px;
        line-height: 1.5;
        text-align: center;
        margin-bottom: 30px;
      }
      .btn-login {
        width: 100%;
      }
    }
  }
</style>
