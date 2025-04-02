import { http, httpGet } from '@/utils/http'

export interface Picture {
  focusPictureID: string
  picturePath: string
}

export interface Notice {
  articleID: string
  title: string
}

export interface News {
  articleID: string
  faceImage: string
  title: string
  description: string
  createdTimeStr: string
}

/** 物业小区 */
export interface CommunityAddress {
  beginDate: Date | null
  buildType: number
  canRentArea: number
  cityID: string
  cityName: string
  companyID: string
  email: string | null
  faceImage: string | null
  fax: string | null
  fixAfterDepreciation: number
  fixAfterNet: number
  fixAfterOriginal: number
  fixPreDepreciation: number
  fixPreNet: number
  fixPreOriginal: number
  landArea: number
  listImage: string | null
  name: string
  ownerType: number
  propertyHeader: string | null
  propertyHeaderPhone: string | null
  propertyID: string
  rentArea: number
  sequenceCode: string
  shengID: string
  shengName: string
  shiID: string
  shiName: string
  structureArea: number
  tel: string | null
  webURL: string | null
  xianID: string
  xianName: string
  zhenID: string
  zhenName: string
}
/** 轮播图 */
export function getFocusPictureList() {
  return http.get<IPageData<Picture>>('/getFocusPictureList.json', { focusID: FOCUSID })
}

/** 通知公告 */
export function getNoticeArticleList() {
  return http.get<IPageData<Notice>>('/getNoticeArticleList.json', { shopID: SHOPID })
}

/** 获取文章 */
export function getNavigatorSimpleArticleList(navigatorID: string, pageNumber?: number) {
  return http.get<IPageData<News>>('/getNavigatorSimpleArticleList.json', {
    navigatorID,
    pageNumber,
  })
}

/** 静默登录 */
export function onLogin(openID: string, deviceID: string, siteID: string) {
  return http.get('/openIDorUnionIDFastLogin.json', { openID, deviceID, siteID })
}

/** 获取停车场列表 */
function getParkList(phone: string) {
  return http.get('/getParkAreaList.json', { phone })
}

/** 文档未描述当前接口信息 */
function getVehicleProcessList() {
  return http.get('/getVehicleProcessList', { sortTypeTime: 2 })
}

/** 违停记录信息 */
function getReleaseVehicleList(vehicleProcessID: string) {
  return httpGet('/getVehicleViolationList.json', { vehicleProcessID })
}

/** 查询车牌信息 */
function getVehicleList() {
  return http.get('/getVehicleList.json', { applicationID: APPLICATIONID })
}

/** 获取物业小区列表 */
function getPropertyList() {
  return http.get<IPageData<CommunityAddress>>('/getPropertyList', { applicationID: APPLICATIONID })
}

/** 获取挪车消息 */
function getMessageList(iLoginSession: ILoginSession) {
  return http.get<IPageData<object>>('/getMessageList.json', { sessionID: iLoginSession.sessionID, receiverMemberID: iLoginSession.memberID })
}

export {
  getMessageList,
  getParkList,
  getPropertyList,
  getReleaseVehicleList,
  getVehicleList,
  getVehicleProcessList,
}
