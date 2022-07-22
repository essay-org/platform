
export function isUrl(path) {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}


/**
 * 示例：/example//demo/  => /example/demo
 * @param {string} path 路由路径
 */
export function uniqueSlash(path) {
 return path.replace(/(?<!:)\/{2,}/g, '/')
}
