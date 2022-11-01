import { omit } from 'lodash-es'
import { nextTick, ref, unref } from "vue"
import SchemaForm from '@/components/core/schema-form'

export function useFormModal() {
  const [ModalRender] = useModal()

  const showModal = async ({modalProps, formProps}) => {
    const formRef = ref()
    const onCancel = (e) => {
      formRef.value?.resetFields()
      modalProps?.onCancel?.(e)
    }

    await ModalRender.show({
      destroyOnClose: true,
      ...omit(modalProps, ['onFinish', 'onFail']),
      onCancel,
      content: () => {
        const _formProps = Object.assign({}, { showActionButtonGroup: false}, formProps)

        return <SchemaForm ref={formRef} {..._formProps}></SchemaForm>
      },
      onOk: async () => {
        let values;
        try {
          values = await formRef.value?.validate();
          await modalProps?.onFinish?.(values);
          formRef.value?.resetFields()
        } catch(error) {
          modalProps?.onFail?.(values)
          return Promise.reject(error)
        }
      }
    })

    await nextTick()

    return [unref(formRef)]
  }

  return [showModal, ModalRender]
}
