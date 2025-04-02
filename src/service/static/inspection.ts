import type * as Inspection from './inspection.type'
import { http } from '@/utils/http'
import dayjs from 'dayjs'

/**
 * 获取路线定义列表
 * @returns 包含路线定义列表的Promise对象
 */
export function getRouteDefineList() {
  return http.get<IPageData<{
    /** 路线定义ID */
    routeDefineID: string
    /** 路线名称 */
    name: string
  }>>('/getRouteDefineList.json')
}

/**
 * 获取巡视实例列表
 * @param params 查询参数
 * @param params.routeDefineID 路线定义ID
 * @param params.memberID 会员ID（可选）
 * @param params.employeeID 员工ID（可选）
 * @param params.sortTypeTime 时间排序类型（1: 升序, 2: 降序）
 * @returns 包含巡视实例列表的Promise对象
 */
export function getRouteInstanceList(params: Inspection.IRouteInstanceParam) {
  return http.get<IPageData<{
    /** 巡视实例ID */
    routeInstanceID: string
    /** 路线定义名称 */
    routeDefineName: string
    /** 名称 */
    name: string
    /** 短名称 */
    shortName: string
    /** 员工名称 */
    employeeName: string
    /** 实际开始时间 */
    realBeginTime: number | null
    /** 实际开始时间字符串 */
    realBeginTimeStr: string | null
    /** 实际结束时间 */
    realEndTime: number | null
    /** 实际结束时间字符串 */
    realEndTimeStr: string | null
  }>>('/getRouteInstanceList.json', {
    memberID: useUserStore().loginSession.memberID,
    employeeID: useUserStore().employeeID,
    sortTypeTime: 2,
    ...params,
  })
}

/**
 * 创建巡视实例
 * @param params 创建参数
 * @param params.routeDefineID 路线定义ID
 * @param params.name 实例名称
 * @param params.memberID 会员ID（可选）
 * @param params.employeeID 员工ID（可选）
 * @param params.planDate 计划日期（可选）
 * @returns 创建结果的Promise对象
 */
export function createOneRouteInstance(params: {
  /** 路线定义ID */
  routeDefineID: string
  /** 实例名称 */
  name: string
  /** 会员ID（可选） */
  memberID?: string
  /** 员工ID（可选） */
  employeeID?: string
  /** 计划日期（可选） */
  planDate?: string
}) {
  return http.get('/createOneRouteInstance.json', {
    memberID: useUserStore().loginSession.memberID,
    employeeID: useUserStore().employeeID,
    planDate: dayjs().format('YYYY-MM-DD'),
    ...params,
  })
}

/**
 * 获取巡视点列表
 * @param params 查询参数
 * @param params.memberID 会员ID（可选）
 * @param params.employeeID 员工ID（可选）
 * @param params.routeInstanceID 巡视实例ID
 * @returns 包含巡视点列表的Promise对象
 */
export function getRouteInstanceDotList(params: {
  /** 会员ID（可选） */
  memberID?: string
  /** 员工ID（可选） */
  employeeID?: string
  /** 巡视实例ID */
  routeInstanceID: string
}) {
  return http.get<IPageData<{
    /** 巡视点实例ID */
    routeInstanceDotID: string
    /** 名称 */
    name: string
    /** 检查结果 */
    resultType: string
    /** 到达时间字符串 */
    comeTimeStr: string
  }>>('/getRouteInstanceDotList.json', {
    memberID: useUserStore().loginSession.memberID,
    employeeID: useUserStore().employeeID,
    ...params,
  })
}

/**
 * 开始一个巡视实例
 * @param params 参数
 * @param params.routeInstanceID 巡视实例ID
 * @returns 包含实际开始时间的Promise对象
 */
export function beginOneRouteInstance(params: {
  /** 巡视实例ID */
  routeInstanceID: string
}) {
  return http.get<IPageData<{
    /** 实际开始时间 */
    realBeginTime: string
  }>>('/beginOneRouteInstance.json', {
    ...params,
  })
}

/**
 * 结束一个巡视实例
 * @param params 参数
 * @param params.routeInstanceID 巡视实例ID
 * @returns 包含实际结束时间的Promise对象
 */
export function endOneRouteInstance(params: {
  /** 巡视实例ID */
  routeInstanceID: string
}) {
  return http.get<IPageData<{
    /** 实际结束时间 */
    realEndTime: string
  }>>('/endOneRouteInstance.json', {
    ...params,
  })
}

/**
 * 到达一个巡视点
 * @param params 参数
 * @param params.routeInstanceDotID 巡视点实例ID
 * @returns 包含实际到达时间的Promise对象
 */
export function comeOneRouteInstanceDot(params: {
  /** 巡视点实例ID */
  routeInstanceDotID: string
}) {
  return http.get<IPageData<{
    /** 实际到达时间 */
    realEndTime: string
  }>>('/comeOneRouteInstanceDot.json', {
    ...params,
  })
}

export interface CheckOneDot {
  /** 巡视点实例ID */
  routeInstanceDotID: string
  /** 结果类型（1 或 2） */
  resultType: 1 | 2
  /** 实际地图X坐标 */
  realMapX: string
  /** 实际地图Y坐标 */
  realMapY: string
  /** 结果备注 */
  resultMemo: string
  /** 问题编号 */
  problemNumber: string
  /** 图片编号 */
  imageNumber: string
}

/**
 * 检查一个巡视点
 * @param params 参数
 * @returns 包含实际结束时间的Promise对象
 */
export function checkOneRouteInstanceDot(params: CheckOneDot) {
  return http.get<IPageData<{
    /** 实际结束时间 */
    realEndTime: string
  }>>('/checkOneRouteInstanceDot.json', {
    ...params,
  })
}
