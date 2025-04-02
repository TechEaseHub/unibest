import { getEmployeeList } from '@/service/static/other'

export const useOtherStore = defineStore(
  'other',
  () => {
    // 经纬度信息
    const locationInfo = ref<UniApp.GetLocationSuccess | null>(null)
    const LocationInfo = computed(() => ({ lon: locationInfo.value?.longitude, lat: locationInfo.value?.latitude }))
    // const GetLocation = async (): Promise<UniApp.GetLocationSuccess | null> => {
    //   try {
    //     console.log('开始获取位置...')
    //     // TODO: H5获取不到`gcj02`坐标，需要进行一个转换
    //     const location = await new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
    //       uni.getLocation({
    //         // #ifdef MP-WEIXIN
    //         type: 'gcj02', // 返回国测局坐标
    //         altitude: true, // 需要获取海拔信息
    //         isHighAccuracy: true, // 启用高精度模式
    //         highAccuracyExpireTime: 3100, // 高精度模式超时（毫秒）
    //         // #endif
    //         success: (e) => {
    //           console.log(e)

    //           resolve(e)
    //         },
    //         fail: reject,
    //       })
    //     })

    //     locationInfo.value = location

    //     // #ifdef H5
    //     console.log('获取位置成功（WGS84）:', location)
    //     const gcj02Location = wgs84ToGcj02(location.latitude, location.longitude)
    //     console.log('转换后的 GCJ02 坐标:', gcj02Location)
    //     locationInfo.value.latitude = gcj02Location.lat
    //     locationInfo.value.longitude = gcj02Location.lon
    //     // #endif

    //     return locationInfo.value
    //   }
    //   catch (error) {
    //     console.error('获取位置失败：', error)
    //     locationInfo.value = null
    //     return null
    //   }
    // }

    const GetLocation = () => {
      console.log('GetLocation')

      uni.getLocation({
        success: (res) => {
          console.log('获取位置成功：', res)
          locationInfo.value = res
          // locationInfo.value.latitude = res.latitude
          // locationInfo.value.longitude = res.longitude
          // locationInfo.value.address = res.address
        },
        fail: (err) => {
          console.error('获取位置失败：', err)
        },
      })
    }

    // 公司成员
    const { data: EmployeeList, run: RunGetEmployeeList } = useRequest(() => getEmployeeList())
    const handleEmployee = ref<string | undefined>()
    const employeeList = computed(() => {
      return EmployeeList.value?.rows?.map((i) => {
        return {
          id: i.employeeID,
          name: i.name,

          label: i.name,
          value: i.employeeID,

          phone: i.phone,
        }
      }) || []
    })

    return {
      LocationInfo,
      locationInfo,
      GetLocation,

      EmployeeList,
      employeeList,
      RunGetEmployeeList,
      handleEmployee,

    }
  },
  {
    persist: true,
  },
)
