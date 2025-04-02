import type * as Other from './other.type'
import { http } from '@/utils/http'

/**
 * 获取指定对象的附件列表
 *
 * @param params - 请求参数对象
 * @param params.objectID - 对象标识符枚举，用于指定要查询的关联对象类型或实例
 * @returns 返回包含附件列表数据的Promise对象
 */
export function getObjectAttachmentList(params: {
  objectID: string
}) {
  return http.get('/getObjectAttachmentList.json', {
    ...params,
  })
}

/**
 * 获取员工列表
 * @param params  请求参数对象
 * @param params.companyID - 对象标识符枚举，用于指定要查询的关联对象类型或实例
 * @returns 返回IpageData格式的员工列表数据
 */
export function getEmployeeList(params?: {
  companyID?: string
}) {
  return http.get<IPageData<Other.IEmployee>>('/getEmployeeList.json', {
    companyID: COMPANYID,
    ...params,
  })
}

export function submObjectAttachment(params: Other.IAttachmentParams) {
  return http.get('/submObjectAttachment.json', {
    ...params,
  })
}
