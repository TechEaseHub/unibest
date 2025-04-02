import type * as Move from './move.type'

/** 停车区列表 */
export function getParkAreaList() {
  return http.get<IPageData<Move.ParkAreaType>>('/getParkAreaList.json')
}

export function getVehicleProcessList(switchDate: Move.ESwitchDate) {
  const UserStore = useUserStore()
  return http.get<IPageData<Move.VehicleProcessTyep>>('/getVehicleProcessList.json', {
    sortTypeTime: 2,
    memberID: UserStore.loginSession.memberID,
    employeeID: UserStore.employee.employeeID,
    switchDate,
  })
}

export function createOneVehicleProcess(params: Move.CreateOneVehicleProcessType) {
  return http.get<{ vehicleProcessId: string }>('/createOneVehicleProcess.json', {
    memberID: useUserStore().loginSession.memberID,
    employeeID: useUserStore().employeeID,
    ...params,
  })
}

/** 获取车辆违章记录列表 */
export function getVehicleViolationList(vehicleProcessID: string) {
  return http.get<IPageData<{ vehicleID: string }>>('/getVehicleViolationList.json', {
    status: '1',
    sortTypeTime: '2',
    vehicleProcessID,
  })
}

/** 开始一个车辆处理 */
export function beginOneVehicleProcess(vehicleProcessID: string) {
  return http.get('/beginOneVehicleProcess.json', {
    vehicleProcessID,
  })
}

/** 创建一个违停记录 */
export function createOneVehicleViolation(params?: Move.CreateVehicleViolationParams) {
  return http.get('/createOneVehicleViolation.json', {
    ...params,
  })
}

/** 离开一个车辆处理记录 */
export function leftOneVehicleProcess(vehicleProcessID: string) {
  return http.get('/leftOneVehicleProcess.json', {
    vehicleProcessID,
  })
}

/**
 * 到达一个车辆处理记录
 * - 到了新的停车场调用
 */
export function arrivedOneVehicleProcess(vehicleProcessID: string) {
  return http.get('/arrivedOneVehicleProcess.json', {
    vehicleProcessID,
  })
}

/**
 * 处置一个车辆违章记录
 * - 获取车辆违章记录列表后，城管把车子放下来循环拍照，对每个车子的违章记录进行修改
 */
export function processOneVehicleViolation(params: Move.ProcessOneVehicleViolationType) {
  return http.get('/processOneVehicleViolation.json', {
    ...params,
  })
}

/**
 * 结束一个车辆处理记录
 * - 处置违章记录完成调用的接口
 */
export function endOneVehicleProcess(vehicleProcessID: string) {
  return http.get('/endOneVehicleProcess.json', {
    vehicleProcessID,
  })
}
