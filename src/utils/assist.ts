// 判断元素是否在数组中
export const oneOf = (value: any, validList: any[]): boolean => {
    return validList.indexOf(value) > -1
}
