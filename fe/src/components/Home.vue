<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统 Logo -->
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="logo">
        <span>platform</span>
      </div>
      <!-- 导航菜单 -->
      <!-- 
        default-active 默认选中哪一项，对应 el-menu-item 的 index 属性
        router 用于开启 vue-router 模式，开启后 index 属性可以写 path 路径，点击可以跳转
        collapse 控制菜单是否展开
       -->
      <el-menu
        :default-active="activeMenu" router
        background-color="#001529" text-color="#fff"
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon><fold /></el-icon>
          </div>
          <div class="bread">
            <BreadCrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge class="notice" :is-dot="noticeCount > 0" type="danger" @click="$router.push('/audit/approve')">
            <el-icon><bell /></el-icon>
          </el-badge>
          <!-- @command 监听点击了哪个 el-dropdown-item 标签，通过 command 属性判断 -->
          <el-dropdown @command="handleLogout">
            <span class="user-link">{{ userInfo.userName }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <!-- 这个 router-view 用于显示 Home 组件路由的子路由组件，如 '/welcome' 对应的 Welcome 组件 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import TreeMenu from './TreeMenu.vue'
  import BreadCrumb from './BreadCrumb.vue'

  export default {
    name: 'HomePage',
    components: { TreeMenu, BreadCrumb },
    data () {
      return {
        isCollapse: false,
        userInfo: this.$store.state.userInfo,
        userMenu: [],
        // 默认选中的菜单项其实对应的就是当前路径，如 localhost:8015/#/welcome，默认选中的就是 /welcome
        activeMenu: location.hash.slice(1)
      }
    },
    computed: {
      noticeCount () {
        return this.$store.state.noticeCount
      }
    },
    mounted () {
      this.getNoticeCount()
      this.getMenuList()
    },
    methods: {
      toggle () {
        this.isCollapse = !this.isCollapse
      },
      handleLogout (key) {
        if (key === 'email') return
        this.$store.commit('saveUserInfo', '')
        this.userInfo = {}
        this.$router.push('/login')
      },
      async getNoticeCount () {
        try {
          const count = await this.$api.noticeCount()
          this.$store.commit('saveNoticeCount', count)
        } catch (error) {
          console.error(error)
        }
      },
      async getMenuList () {
        try {
          const { menuList, actionList } = await this.$api.getPermissionList()
          this.userMenu = menuList
          this.$store.commit('saveUserMenu', menuList)
          this.$store.commit('saveUserAction', actionList)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>

<style lang="less">
  .basic-layout {
    position: relative;
    .nav-side {
      position: fixed;
      width: 200px;
      height: 100vh;
      background-color: #001529;
      color: #fff;
      overflow-y: auto;  /* 侧边栏菜单多的话自动出现滚动条 */
      transition: width .5s;  /* 侧边栏未来是可收缩的，先给个过渡效果 */
      &.fold {  // 菜单合并
        width: 64px;
        overflow: hidden;  // 菜单收缩合并后，就不要滚动条了，也让超出的东西隐藏起来
      }
      &.unfold {  // 菜单展开
        width: 200px;
      }
      .logo {
        display: flex;
        align-items: center;
        font-size: 18px;
        height: 50px;
        img {
          width: 32px;
          height: 32px;
          margin: 0 16px;
        }
      }
      .nav-menu {
        height: calc(100vh - 50px);
        border-right: none;  // el-menu 右侧会有 1px 的 border，这里将其删除
      }
    }
    .content-right {
      margin-left: 200px;  // 这个距离不是固定不变的，应该随着 nav-side 的宽度而变化
      &.fold {  // 菜单合并
        margin-left: 64px;
      }
      &.unfold {  // 菜单展开
        margin-left: 200px;
      }
      .nav-top {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        padding: 0 20px;
        .nav-left {
          display: flex;
          align-items: center;
          .menu-fold {
            margin-right: 15px;
            font-size: 18px;
            padding-top: 4px;
          }
        }
        .user-info {
          display: flex;
          align-items: center;
          .notice {
            line-height: 0px;
            margin-right: 15px;
            cursor: pointer;
          }
          .user-link {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
      .wrapper {
        background-color: #eef0f3;
        padding: 20px;
        /*
          这里 100vh 是页面视口高度，减去 nav-top 的 50px 就得到了 wrapper 的高度，至于 padding 上下的 40px 不用管
          因为引入的 index.less 中设置了除 element-plus 元素外的所有元素为 border-box 模型
         */
        height: calc(100vh - 50px);
      }
    }
  }
</style>
