import {
  getMessageList,
} from '@/service/static/index'

import {
  bandingEmployeeWithPhone,
  getMyCompanyAndEmployeeList,
  getMyMemberMajorList,
  getOneMemberDetail,
  getWeiXinAppOpenId,

  memberPhoneRegister,

  openIDorUnionIDFastLogin,
} from '@/service/static/login'

import dayjs from 'dayjs'

export const useUserStore = defineStore(
  'user',
  () => {
    const openID = ref<string | undefined>()
    const getOpenId = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (openID.value) {
          return resolve(openID.value)
        }

        // #ifdef MP-WEIXIN
        uni.login({
          provider: 'weixin',
          success: async ({ code }) => {
            try {
              const { openID: openId } = await getWeiXinAppOpenId(code)
              openID.value = openId
              resolve(openID.value)
            }
            catch (error) {
              reject(error)
            }
          },
          fail: (error) => {
            reject(error)
          },
        })
        // #endif

        // #ifdef H5
        console.log('🐛 发起网络请求获取 openID ......')
        openID.value = import.meta.env.VITE_WX_OPENID
        resolve(openID.value)
        // #endif
      })
    }

    const loginSession = ref<ILoginSession | undefined>()

    const { data: MyMajorList, run: RunGetMyMajor } = useRequest(() => getMyMemberMajorList())
    const { data: MyCompanyAndEmployeeList, run: RunGetMyCompanyAndEmployee } = useRequest(() => getMyCompanyAndEmployeeList())
    const { data: OneMemberDetail, run: RunGetOneMemberDetail } = useRequest(() => getOneMemberDetail(loginSession.value?.memberID))
    const { data: BandingEmployee, run: RunBandingEmployee } = useRequest(() => bandingEmployeeWithPhone(OneMemberDetail.value?.phone))

    // 函数重载声明
    function handleAuth(action: 'wxLogin'): Promise<void>
    function handleAuth(action: 'wxRegister', params: { phone: string, name: string }): Promise<void>
    async function handleAuth(action: 'wxLogin' | 'wxRegister', params?: { phone: string, name: string }): Promise<void> {
      try {
        // 获取 openID
        const openID = await getOpenId()

        let sessionID: string
        let memberID: string

        switch (action) {
          case 'wxLogin':
            ({ sessionID, memberID } = await openIDorUnionIDFastLogin(openID))
            break

          case 'wxRegister':{
            const { phone, name } = params
            if (!phone || !name) {
              throw new Error('缺少注册所需的 phone 或 name 参数')
            }

            ({ sessionID, memberID } = await memberPhoneRegister({ phone, name, openID }))
          }
            break
          default:
            throw new Error('未知的登录方式')
        }

        // 存储登录信息
        loginSession.value = { sessionID, memberID, time: dayjs() }

        // 获取身份列表
        await RunGetMyMajor()

        // 获取会员信息
        await RunGetOneMemberDetail()

        if (isChengguan.value) {
          await RunGetMyCompanyAndEmployee()

          if (!MyCompanyAndEmployeeList.value.length) {
            await RunBandingEmployee()
          }
        }
      }
      catch (error) {
        console.error(`${action}过程中发生错误:`, error)
      }
    }

    const isLogined = computed(() => loginSession.value?.memberID && loginSession.value?.sessionID)
    const isLoginExpired = computed(() => {
      return !loginSession.value || dayjs().diff(loginSession.value.time, 'minute') > 60
    })

    const isChengguan = computed(() => {
      return MyMajorList.value?.rows.some(item => item.majorID === MAJOR_ID_CHENGGUAN)
    })

    const employee = computed(() => {
      return {
        id: MyCompanyAndEmployeeList.value?.[0]?.employeeID ?? '',
        name: MyCompanyAndEmployeeList.value?.[0]?.employeeName ?? '',
        employeeID: MyCompanyAndEmployeeList.value?.[0]?.employeeID ?? '',
        employeeName: MyCompanyAndEmployeeList.value?.[0]?.employeeName ?? '',
        companyID: MyCompanyAndEmployeeList.value?.[0]?.companyID ?? '',
        companyName: MyCompanyAndEmployeeList.value?.[0]?.companyName ?? '',
      }
    })
    const employeeID = computed(() => MyCompanyAndEmployeeList.value?.[0]?.employeeID ?? '')

    // 头像
    const avatarURL = computed(() => OneMemberDetail.value?.avatarURL || 'https://imgs.699pic.com/images/500/465/562.jpg!list1x.v2')

    // 用户是否非法停车
    const { data: userIllegalityPollUp, run: getUserIllegalityPollUp } = useRequest(() => getMessageList(loginSession.value))

    return {
      openID,
      getOpenId,

      loginSession,
      handleAuth,

      MyMajorList,
      MyCompanyAndEmployeeList,
      OneMemberDetail,
      RunGetOneMemberDetail,
      BandingEmployee,

      isLogined,
      isLoginExpired,
      isChengguan,
      employee,
      employeeID,

      avatarURL,

      userIllegalityPollUp,
      getUserIllegalityPollUp,

    }
  },
  {
    persist: true,
  },
)
