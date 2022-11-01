import { installUseModal } from './useModal'

// 导出
export { useFormModal } from './useFromModal'
export { useModal } from './useFormModal'
export const install = (app) => {
  installUseModal(app)
}
export default install
