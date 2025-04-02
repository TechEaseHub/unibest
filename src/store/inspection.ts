import type * as Inspection from '@/service/static/inspection.type'
import {
  getRouteDefineList,
  getRouteInstanceDotList,
  getRouteInstanceList,
} from '@/service/static/inspection'

import dayjs from 'dayjs'

export const useInspection = defineStore(
  'inspection',
  () => {
    // 路线定义
    const {
      data: RouteDefine,
      run: RunGetRouteDefineList,
    } = useRequest(() => getRouteDefineList())
    const handleRouteDefineIdx = ref<number | undefined>(undefined)
    const routeDefine = computed(() => {
      return RouteDefine.value?.rows?.map((i) => {
        return {
          id: i.routeDefineID,
          name: i.name,

          label: i.name,
          value: i.routeDefineID,
        }
      }) || []
    })
    const HandleRouteDefine = computed(() => {
      const index = handleRouteDefineIdx.value
      const list = routeDefine.value

      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list[index]
      }
      return undefined
    })
    const UnLoadRouteDefine = () => {
      console.log('离开路线列表')

      RouteDefine.value = undefined
      UnLoadRouteInstance()
    }

    // 巡视实例
    const RouteInstanceParams = ref<Inspection.IRouteInstanceParam | undefined>()
    const { data: RouteInstanceList, run: RunGetRouteInstanceList } = useRequest(() => getRouteInstanceList(RouteInstanceParams.value))
    const handleRouteInstanceIdx = ref<number | undefined>(undefined)
    const routeInstanceList = computed(() => {
      return RouteInstanceList.value?.rows?.map((i) => {
        return {
          id: i.routeInstanceID,
          name: i.name,

          title: i.name,
          label: i.routeDefineName,
          value: i.employeeName,

          realBeginTime: i.realBeginTime,
          realBeginTimeStr: i.realBeginTimeStr,
          realEndTime: i.realEndTime,
          realEndTimeStr: i.realEndTimeStr,
        }
      }) || []
    })
    const HandleRouteInstance = computed(() => {
      const index = handleRouteInstanceIdx.value
      const list = routeInstanceList.value

      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list[index]
      }
      return undefined
    })
    const UnLoadRouteInstance = () => {
      console.log('离开路线  =》 实例列表')

      RouteInstanceList.value = undefined
      handleRouteDefineIdx.value = undefined
      UnLoadDotList()
    }

    // 实例巡视点
    const {
      data: RouteInstanceDotList,
      run: RunGetRouteInstanceDotList,
    } = useRequest(() => getRouteInstanceDotList({
      routeInstanceID: HandleRouteInstance.value.id,
    }))
    const handleRouteInstanceDotIdx = ref<number | undefined>(undefined)
    const routeInstanceDotList = computed(() => {
      return RouteInstanceDotList.value?.rows?.map(i => ({
        id: i.routeInstanceDotID,
        name: i.name,

        title: i.name,

        resultType: i.resultType,
        comeTimeStr: i.comeTimeStr,
      })) || []
    })
    const HandleRouteInstanceDot = computed(() => {
      const index = handleRouteInstanceDotIdx.value
      const list = routeInstanceDotList.value

      if (typeof index === 'number' && index >= 0 && index < list.length) {
        return list[index]
      }
      return undefined
    })
    const UnLoadDotList = () => {
      console.log('离开路线  =》 实例  =》  检查点')
      RouteInstanceDotList.value = undefined
      handleRouteInstanceIdx.value = undefined
      toDayUserInstanceAndMoveList()
      UnLoadDot()
    }

    /** 离开巡视点位 */
    const UnLoadDot = () => {
      handleRouteInstanceDotIdx.value = undefined
    }

    const HeaderOptions = computed(() => {
      return [
        { label: '巡视路线', value: HandleRouteDefine.value?.name },
        { label: '巡视实例', value: HandleRouteInstance.value?.name },
        { label: '巡视点位', value: HandleRouteInstanceDot.value?.name },
        { label: '到达时间', value: HandleRouteInstanceDot.value?.comeTimeStr },
      ]
    })

    //
    const instanceExectionNum = ref(0)

    // 获取今天当天用户巡视、挪车列表
    async function toDayUserInstanceAndMoveList() {
      console.log('获取今天当天用户巡视、挪车列表')
      RouteInstanceParams.value = {
        beginTime: `${dayjs().format('YYYY-MM-DD')} 00:00:00`,
        endTime: `${dayjs().add(1, 'day').format('YYYY-MM-DD')} 00:00:00`,
      }

      const instanceNum = ref(0)
      console.log('RouteInstanceParams', RouteInstanceParams.value)
      // 获取今日巡视路线
      await RunGetRouteInstanceList()
      instanceNum.value = RouteInstanceList.value.rows?.length
      console.log('routeInstance', RouteInstanceList.value)

      const temporaryDotNum = ref(0)
      // 异常次数
      for (let i = 0; i < RouteInstanceList.value.rows.length; i++) {
        handleRouteInstanceIdx.value = i
        await RunGetRouteInstanceDotList()
        // 目前type 2 异常
        RouteInstanceDotList.value?.rows?.forEach((item) => {
          if (item.resultType === '2') {
            temporaryDotNum.value++
          }
        })

        console.log('routeInstanceDot', RouteInstanceDotList.value)
      }
      instanceExectionNum.value = temporaryDotNum.value
    }

    return {
      // 路线定义
      RouteDefine,
      routeDefine,
      RunGetRouteDefineList,
      handleRouteDefineIdx,
      HandleRouteDefine,
      UnLoadRouteDefine,

      // 巡视实例
      RouteInstanceParams,
      RunGetRouteInstanceList,
      RouteInstanceList,
      routeInstanceList,
      handleRouteInstanceIdx,
      HandleRouteInstance,
      UnLoadRouteInstance,

      // 实例巡视点
      RouteInstanceDotList,
      routeInstanceDotList,
      RunGetRouteInstanceDotList,
      handleRouteInstanceDotIdx,
      HandleRouteInstanceDot,
      UnLoadDotList,

      UnLoadDot,

      HeaderOptions,
      toDayUserInstanceAndMoveList,
      instanceExectionNum,
    }
  },
  {
    persist: true,
  },
)
