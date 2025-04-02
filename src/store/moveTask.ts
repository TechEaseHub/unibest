import type { CreateVehicleViolationParams } from '@/service/static/move.type'
import * as MoveAPI from '@/service/static/move'

export const useMoveTaskStore = defineStore(
  'moveTask',
  () => {
    const { HandleVehicleProcess, VehicleProcessList, handleVehicleProcess } = storeToRefs(useMoveStore())

    watch(VehicleProcessList.value, () => {
      // 4=开始任务 5=离开原地点 6=到达新地点
      // 获取违停车辆数量
      ViolationNum.value = 0
      VehicleProcessList.value.rows?.forEach(async (item) => {
        handleVehicleProcess.value = item.vehicleProcessID
        await RunGetViolationList()
        ViolationNum.value += ViolationList.value.rows?.length
      })
    })

    // 挪车车辆数量
    const ViolationNum = ref(0)

    /**
     * 查询违停记录
     * - 根据 vehicleID 查询车辆详情
     * - 显示车辆卡片
     */
    const {
      data: ViolationList,
      run: RunGetViolationList,
    } = useRequest(() => MoveAPI.getVehicleViolationList(HandleVehicleProcess.value.vehicleProcessID))

    /** 创建违停参数 */
    const violationParams = ref<CreateVehicleViolationParams | undefined>()
    const { data: CreateOneVehicleViolation, run: RunCreateOneVehicleViolation } = useRequest(() =>
      MoveAPI.createOneVehicleViolation(violationParams.value),
    )

    const { data: BeginOneVehicleProcess, run: RunBeginOneVehicleProcess } = useRequest(() =>
      MoveAPI.beginOneVehicleProcess(HandleVehicleProcess.value.id),
    )

    return {
      ViolationList,
      RunGetViolationList,

      CreateOneVehicleViolation,
      violationParams,
      RunCreateOneVehicleViolation,

      BeginOneVehicleProcess,
      RunBeginOneVehicleProcess,
      ViolationNum,
    }
  },
  { persist: true },
)
