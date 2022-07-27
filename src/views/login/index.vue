<template>
  <div class="login">
    <div class="title">Admin Platform</div>

    <a-form
      layout="horizontal"
      :model="state.formInline"
      @submit.prevent="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-model:value="state.formInline.username"
          size="large"
          placeholder="rootadmin"
        >
          <template #prefix><user-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="state.formInline.password"
          size="large"
          type="password"
          placeholder="123456"
        >
          <template #prefix><lock-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          :loading="state.loading"
          block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { message, Modal } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const state = reactive({
      laoding: false,
      formInline: {
        username: "",
        password: "",
      },
    });

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const handleSubmit = async () => {
      const { username, password } = state.formInline;
      if (username.trim() === "" || password.trim() === "") {
        return message.error("用户名或密码不能为空！");
      }
      message.loading("登录中...", 0);
      state.loading = true;
      try {
        await userStore.login(state.formInline).finally(() => {
          state.loading = false;
          message.destroy();
        });

        message.success("登录成功");
        // 跳转到redirect地址
        setTimeout(() => router.replace(route.query.redirect) || "/");
      } catch (error) {
        Modal.error({
          title: () => "提示",
          content: () => error.message,
        });
      }
    };
    return {
      state,
      handleSubmit,
    };
  },
});
</script>
<style lang="less" scoped>
:deep(.ant-form) {
  width: 400px;

  .ant-col {
    width: 100%;
  }

  .ant-form-item-label {
    padding-right: 6px;
  }
}
.login {
  display: flex;
  width: 100vw;
  height: 100vh;
  padding-top: 240px;
  background: url("@/assets/login.svg");
  background-size: 100%;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
