export enum ESwitchDate {
  本日 = '1',
  本周 = '2',
  本月 = '3',
}

export enum EProcessType {
  摆正 = '1',
  拖走 = '2',
  没收 = '3',
}

export enum EVehicleStatus {
  新建 = '1',
  处置中 = '2',
  审核通过 = '3',
  审核拒绝 = '4',
  检验完成 = '10',
  取车完成 = '20',
}

/** 停车区 */
export interface ParkAreaType {
  parkAreaID: string
  name: string
  address: string
  mapX: string
  mapY: string
  spaceBalance: number
}

/** 违停列表 */
export interface VehicleProcessTyep {
  /** 车辆处理记录ID */
  vehicleProcessID: string
  name: string
  /** 挪车任务状态 */
  status: number

  /** 开始时间 */
  beginTime: string
  /** 开始停车区域ID */
  beginParkAreaID: string
  /** 开始停车区域名称 */
  beginParkAreaName: string
  /** 开始停车单元ID */
  beginParkUnitID?: string | null
  /** 开始停车单元名称 */
  beginParkUnitName?: string | null
  /** 开始地图X坐标 */
  beginMapX?: number | null
  /** 开始地图Y坐标 */
  beginMapY?: number | null
  /** 开始地图地址 */
  beginMapAddress?: string | null

  /** 出发时间 */
  leftTime: string
  /** 到达时间 */
  arrivedTime: string

  /** 结束停车区域ID */
  endParkAreaID?: string | null
  /** 结束停车区域名称 */
  endParkAreaName?: string | null
  /** 结束停车单元ID */
  endParkUnitID?: string | null
  /** 结束停车单元名称 */
  endParkUnitName?: string | null
  /** 结束地图X坐标 */
  endMapX?: number | null
  /** 结束地图Y坐标 */
  endMapY?: number | null
  /** 结束地图地址 */
  endMapAddress?: string | null
  /** 结束时间 */
  endTime: string
}

/** 创建挪车记录 */
export interface CreateOneVehicleProcessType {
  /** 当前挪车名称 */
  name: string
  /** 停车区域ID */
  beginParkAreaID?: string
}

/** 新增车辆违章记录请求参数 */
export interface CreateVehicleViolationParams {
  /** 车辆处理记录ID */
  vehicleProcessID: string
  /** 违停名称 */
  name: string
  /**  车辆 ID */
  vehicleID: string
  /** 车主的ID，在车辆列表中获取 */
  memberID?: string
}

/** 处置一个车辆违章记录 */
export interface ProcessOneVehicleViolationType {
  /** 车辆违章ID */
  vehicleViolationID: string
  /** 当前所在的 停车场 */
  parkAreaID: string
  /** 城管公司的ID */
  processCompanyID: string
  /** 城管会员的ID */
  processMemberID: string
  /** 城管员工的ID */
  processEmployeeID: string
  /**
   * 城管选择的处置类型
   * - 1=摆正 2=拖走 3=没收 挪车了一般写死为2
   */
  processType: string
  /** 处置说明 */
  processMemo?: string

  mapX: string
  mapY: string
}
