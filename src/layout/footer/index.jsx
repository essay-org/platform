import { defineComponent } from "vue";
import styles from "./index.module.less";
import { GithubOutlined, CopyrightOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'PageFooter',
  components: {
  },
  setup() {
    return () => (
      <>
        <a-layout-footer class={styles.footer}>
          <div class={styles.link}>
            <a href="https://github.com/vuejs">Vue3.x</a>
          </div>
          <a href="https://github.com/wmui" target="_blank" class={styles.github}>
            <GithubOutlined></GithubOutlined>
          </a>
          <div class={styles.copyright}>Copyright <CopyrightOutlined></CopyrightOutlined> 2022</div>
        </a-layout-footer>
      </>
    )
  }
})
