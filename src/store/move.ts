import { getParkAreaList, getVehicleProcessList } from '@/service/static/move'
import * as Move from '@/service/static/move.type'

export const useMoveStore = defineStore(
  'move',
  () => {
    // 停车区
    const { data: ParkAreaList, run: RunGetParkAreaList } = useRequest(() => getParkAreaList())
    const parkAreaList = computed(() => ParkAreaList.value?.rows.map((i) => {
      return {
        id: i.parkAreaID,
        name: i.name,
        value: i.parkAreaID,
        label: i.name,
      }
    }))
    const handleParkArea = ref<string | undefined>()
    const HandleParkArea = computed(() => parkAreaList.value?.find(i => i.id === handleParkArea.value))

    // 挪车记录
    const vehicleProcessParams = ref<Move.ESwitchDate | undefined>(Move.ESwitchDate.本日)
    const { data: VehicleProcessList, run: RunGetVehicleProcessList } = useRequest(() => getVehicleProcessList(vehicleProcessParams.value))
    const vehicleProcessList = computed(() => {
      return VehicleProcessList.value?.rows.map((i) => {
        return {
          id: i.vehicleProcessID,
          name: i.name,

          vehicleProcessID: i.vehicleProcessID,
          beginTime: i.beginTime,
          beginParkAreaID: i.beginParkAreaID,
          beginParkAreaName: i.beginParkAreaName,
          beginParkUnitID: i.beginParkUnitID,
          beginParkUnitName: i.beginParkUnitName,
          beginMapX: i.beginMapX,
          beginMapY: i.beginMapY,
          beginMapAddress: i.beginMapAddress,
          leftTime: i.leftTime,
          arrivedTime: i.arrivedTime,
          endParkAreaID: i.endParkAreaID,
          endParkAreaName: i.endParkAreaName,
          endParkUnitID: i.endParkUnitID,
          endParkUnitName: i.endParkUnitName,
          endMapX: i.endMapX,
          endMapY: i.endMapY,
          endMapAddress: i.endMapAddress,
          endTime: i.endTime,
        }
      }) || []
    })
    const handleVehicleProcess = ref<string | undefined>()
    const HandleVehicleProcess = computed(() => vehicleProcessList.value?.find(i => i.vehicleProcessID === handleVehicleProcess.value))

    return {
      // 停车区
      RunGetParkAreaList,
      ParkAreaList,
      parkAreaList,
      handleParkArea,
      HandleParkArea,

      vehicleProcessParams,
      RunGetVehicleProcessList,
      VehicleProcessList,
      vehicleProcessList,
      /** 当前进行挪车操作的ID */
      handleVehicleProcess,
      HandleVehicleProcess,

    }
  },
  { persist: true },
)
