import { http } from '@/utils/http'

/** 登录授权页面 获取手机号 */
export function getWeixinMemberPhone(params: {
  encryptedData: string
  iv: string
  js_code: string
}) {
  return http.get<{ phoneNumber: string }>('/getWeixinMemberPhone.json', {
    appID: APPID,
    ...params,
  })
}

/** 获取openID */
export function getWeiXinAppOpenId(code: string) {
  return http.get<{ openID: string }>('/getWeiXinAppOpenId.json', {
    publicNo: PUBLICNO,
    js_code: code,
  })
}

/** 静默登录 */
export function openIDorUnionIDFastLogin(openID: string) {
  return http.get<ILoginSession>('/openIDorUnionIDFastLogin.json', {
    deviceID: DEVICEID,
    siteID: SITEID,
    openID,
  })
}

export interface MemberMajor {
  majorID: string
}
/** 获取身份 */
export function getMyMemberMajorList() {
  return http.get<IPageData<MemberMajor>>('/getMyMemberMajorList.json')
}

export interface CompanyAndEmployee {
  employeeID: string
  employeeName: string
  companyID: string
  companyName: string
}
/** 查询所属公司 */
export function getMyCompanyAndEmployeeList() {
  return http.get<CompanyAndEmployee[]>('/getMyCompanyAndEmployeeList.json', {
    companyID: COMPANYID,
  })
}

export interface OneMemberDetail {
  phone: string
  avatarURL: string
  propertyID: string
  shortName: string
  propertyName: string
}
/** 会员信息 */
export function getOneMemberDetail(memberID: string) {
  return http.get<OneMemberDetail>('/getOneMemberDetail.json', { memberID })
}

export interface EmployeeWithPhone {
  employeeID: string
}
export function bandingEmployeeWithPhone(phone: string) {
  return http.get<EmployeeWithPhone>('/bandingEmployeeWithPhone.json', { phone })
}
/** 通过手机号查询是否存在用户 */
export function searchMemberByPhone(phone: string) {
  return http.get<{ phone: string }>('/searchMemberByPhone.json', { applicationID: APPLICATIONID, phone })
}

/** 注册 */
export function memberPhoneRegister(params: { phone: string, name: string, openID: string }) {
  return http.get<ILoginSession>('/memberPhoneRegister.json', {
    deviceID: DEVICEID,
    siteID: SITEID,
    phone: params.phone,
    loginName: params.phone,
    name: params.name,
    shortName: params.name,
    verifyCode: '999999',
    password: '111111',
    openID: params.openID,
  })
}
