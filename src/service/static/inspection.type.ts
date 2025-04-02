export interface IRouteInstanceParam {
  /** 路线定义ID */
  routeDefineID?: string
  /** 会员ID（可选） */
  memberID?: string
  /** 员工ID（可选） */
  employeeID?: string
  /** 时间排序类型（1: 升序, 2: 降序） */
  sortTypeTime?: 1 | 2
  /** 开始日期 固定写法 今天日期+ 00:00:00  */
  beginTime?: string
  /** 结束日期 固定写法 今天日期+ 23:59:59  */
  endTime?: string
}
