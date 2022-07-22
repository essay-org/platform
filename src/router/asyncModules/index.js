export const constantRouteComponents = {};

const moduleFiles = import.meta.glob('./**/*.js', {eager: true});

Object.keys(moduleFiles).forEach(path => {
  // 排除掉index文件
  if(path.startsWith('./index.')) return

  const value = moduleFiles[path].default;

  Object.keys(value).forEach(ele => {
    constantRouteComponents[ele] = value[ele]
  })
})

console.log('constantRouterComponents', constantRouterComponents);
