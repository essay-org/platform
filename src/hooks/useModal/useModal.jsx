import { createVNode, nextTick,getCurrentInstance, render } from "vue";
import { MyModal } from './modal'
let _app;

export const useModal = () => {
  let _modalInstallce;
  const modalRef = ref();
  const appContent = _app?._conotent || getCurrentInstance()?.appContent; // TODO: 这里的作用
  const isAppChild = ref(false);

  const getModalInstance = async () => {
    await nextTick()
    if(isAppChild.value && modalRef.value) {
      return modalRef.value
    }

    if(_modalInstallce) {
      return _modalInstallce
    }

    const container = document.createElement('div')
    const vnode = createVNode(MyModal)
    vnode.appContext = appContent
    render(vnode, container)

    _modalInstallce = vnode.component;
    _modalInstallce.props.closeModal = hide;
    return _modalInstallce;
  }

  const setProps = async (_props) => {
    const instance = await getModalInstance()
    if(Object.is(instance, modalRef.value)) {
      instance?.exposed?.setProps?.(_props)
    } else {
      instance?.exposed?.setProps?.(_props)
    }
  }

  const hide = () => {
    setProps({visible: false})
  }

  const show = async (props) => {
    setProps({
      ...props,
      closeModal: hide,
      visible: true
    })
  }

  await nextTick()

  const ModalRender = (props, { attrs, slots}) => {
    isAppChild.value = true
    return <MyModal ref={modalRef} {...{...attrs, ...props }} v-slots={slots} />
  }

  ModalRender.show = show
  ModalRender.hide = hide
  ModalRender.setProps = setProps

  return [ModalRender, modalRef]
}

export const installUseModal = (app) => {
  _app = app
}
