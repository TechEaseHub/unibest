interface Location {
  lat: number
  lon: number
  distance?: number
  address?: string
}
/**
 * 将角度转换为弧度
 * @param deg 角度值
 * @returns 对应的弧度值
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * 计算两点之间的 Haversine 大圆距离（单位：米）
 * @param lat1 第一点的纬度
 * @param lon1 第一点的经度
 * @param lat2 第二点的纬度
 * @param lon2 第二点的经度
 * @returns 两点之间的直线距离（单位：米）
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // 地球半径（单位：米）

  // 转换为弧度
  const lat1Rad = deg2rad(lat1)
  const lon1Rad = deg2rad(lon1)
  const lat2Rad = deg2rad(lat2)
  const lon2Rad = deg2rad(lon2)

  // 计算经纬度差
  const deltaLat = lat2Rad - lat1Rad
  const deltaLon = lon2Rad - lon1Rad

  // 使用 Haversine 公式计算球面距离
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c) // 取整，单位：米
}

/**
 * WGS84 转 GCJ02（适用于 H5 端获取 GPS 坐标后转换）
 * @param lat WGS84 纬度
 * @param lon WGS84 经度
 * @returns GCJ02 坐标（对象 { lat, lon }）
 */
export function wgs84ToGcj02(lat: number, lon: number): Location {
  const PI = Math.PI
  const a = 6378245.0 // 地球椭球体长半轴
  /* eslint-disable no-loss-of-precision */
  const ee = 0.00669342162296594323
  /* eslint-enable no-loss-of-precision */

  function transformLat(x: number, y: number) {
    let ret
      = -100.0
        + 2.0 * x
        + 3.0 * y
        + 0.2 * y * y
        + 0.1 * x * y
        + 0.2 * Math.sqrt(Math.abs(x))
    ret
      += (20.0 * Math.sin(6.0 * x * PI)
        + 20.0 * Math.sin(2.0 * x * PI))
      * 2.0 / 3.0
    ret
      += (20.0 * Math.sin(y * PI)
        + 40.0 * Math.sin(y / 3.0 * PI))
      * 2.0 / 3.0
    ret
      += (160.0 * Math.sin(y / 12.0 * PI)
        + 320 * Math.sin(y * PI / 30.0))
      * 2.0 / 3.0
    return ret
  }

  function transformLon(x: number, y: number) {
    let ret
      = 300.0
        + x
        + 2.0 * y
        + 0.1 * x * x
        + 0.1 * x * y
        + 0.1 * Math.sqrt(Math.abs(x))
    ret
      += (20.0 * Math.sin(6.0 * x * PI)
        + 20.0 * Math.sin(2.0 * x * PI))
      * 2.0 / 3.0
    ret
      += (20.0 * Math.sin(x * PI)
        + 40.0 * Math.sin(x / 3.0 * PI))
      * 2.0 / 3.0
    ret
      += (150.0 * Math.sin(x / 12.0 * PI)
        + 300.0 * Math.sin(x / 30.0 * PI))
      * 2.0 / 3.0
    return ret
  }

  function outOfChina(lat: number, lon: number) {
    return lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271
  }

  if (outOfChina(lat, lon)) {
    return { lat, lon }
  }

  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)

  return { lat: lat + dLat, lon: lon + dLon }
}

/** Hook：批量计算多个坐标点到目标点的距离，并找出最近的点 */
export function useDistanceCalculator() {
  // 存储所有计算出的距离
  const distances = ref<Location[]>([])

  // 存储最近的坐标点
  const closestLocation = ref<Location | null>(null)

  const calculateDistances = (target: Location, locations: Location[]) => {
    if (locations.length === 0) {
      distances.value = []
      closestLocation.value = null
      return { distances: [], closest: null }
    }

    // 计算所有点到目标点的距离
    distances.value = locations.map(loc => ({
      ...loc,
      distance: calculateDistance(target.lat, target.lon, loc.lat, loc.lon),
    }))

    // 找到最近的点
    closestLocation.value = distances.value.reduce(
      (min, loc) => (loc.distance < min.distance ? loc : min),
      distances.value[0],
    )

    return { distances: distances.value, closest: closestLocation.value }
  }

  /** 重置距离计算结果 */
  const reset = () => {
    distances.value = []
    closestLocation.value = null
  }

  return { distances, closestLocation, calculateDistances, reset }
}
