import { useUserStore } from '@/store'
import { http } from '@/utils/http'
import dayjs from 'dayjs'

export interface RouteInstance {
  routeInstanceID: string
  /** 关联的路线名称 */
  routeDefineName: string
  /** 巡视实例名称 */
  name: string
  /** 巡视实例简称 */
  shortName: string

  employeeName: string

  realBeginTime: number | null
  realBeginTimeStr: string
  realEndTime: number | null
  realEndTimeStr: string | null
}
/**
 * Retrieves a paginated list of route instances.
 *
 * This function sends a GET request to the "/getRouteInstanceList.json" endpoint to fetch route instances
 * based on the specified criteria. It uses the current user's member ID by default and sets the sort type to 2,
 * unless overridden in the provided parameters.
 *
 * @param params - An object containing:
 *   - routeDefineID: The identifier of the route definition to filter instances.
 *   - memberID: Optional member identifier; if omitted, the current session's member ID is used.
 *   - employeeID: Optional employee identifier for additional filtering.
 *   - sortTypeTime: Optional sort type (allowed values are 1 or 2); defaults to 2.
 *
 * @returns A promise that resolves with paginated data of route instances.
 *
 * @example
 * getRouteInstanceList({ routeDefineID: "abc123" }).then(data => {
 *   console.log(data);
 * });
 */
export function getRouteInstanceList(params: {
  routeDefineID: string
  memberID?: string
  employeeID?: string
  sortTypeTime?: 1 | 2
}) {
  return http.get<IPageData<RouteInstance>>('/getRouteInstanceList.json', {
    memberID: useUserStore().loginSession.memberID,
    sortTypeTime: 2,
    ...params,
  })
}

export interface RouteDefine {
  routeDefineID: string
  name: string
}
/**
 * Retrieves a list of route definitions.
 *
 * Sends an HTTP GET request to the '/getRouteDefineList.json' endpoint and returns the data
 * as a paginated collection of route definitions.
 *
 * @returns A promise that resolves with the paginated route definition data.
 */
export function getRouteDefineList() {
  return http.get<IPageData<RouteDefine>>('/getRouteDefineList.json')
}

/**
 * Creates a new route instance for a specific route definition.
 *
 * This function sends a GET request to "/createOneRouteInstance.json" with a set of parameters
 * that include the route definition ID and instance name. It automatically sets the planned date to
 * the current date (formatted as "YYYY-MM-DD") and uses the member ID from the user store, unless
 * overridden via the parameters.
 *
 * @param params - An object with the following properties:
 *   - routeDefineID: The identifier of the route definition.
 *   - name: The name of the new route instance.
 *   - employeeID: (Optional) The employee identifier associated with the instance.
 *   - memberID: (Optional) The member identifier; defaults to the user store's current member ID.
 *   - planDate: (Optional) The planned date for the route instance; defaults to the current date.
 *
 * @returns A promise resolving with the API response.
 */
export function createOneRouteInstance(params: {
  routeDefineID: string
  name: string
  memberID?: string
  employeeID?: string
  planDate?: string
}) {
  return http.get('/createOneRouteInstance.json', {
    memberID: useUserStore().loginSession.memberID,
    planDate: dayjs().format('YYYY-MM-DD'),
    ...params,
  })
}

export interface RouteInstanceDot {
  routeInstanceDotID: string
  name: string

  routeDefineDotID: string
  routeDefineDotName: string
  routeDefineID: string
  routeDefineName: string
  routeInstanceID: string
  routeInstanceName: string
  serviceCompanyID: string
  serviceCompanyName: string
}
/**
 * Retrieves a paginated list of route instance dots.
 *
 * Sends a GET request to the '/getRouteInstanceDotList.json' endpoint to fetch dots associated
 * with a specific route instance. The provided parameters include a required member identifier
 * and route instance identifier, along with optional filters for route definition and dot.
 *
 * @param params - An object containing:
 *   - memberID: Identifier for the member.
 *   - routeInstanceID: Identifier of the route instance.
 *   - routeDefineID: (Optional) Filter to restrict dots by route definition.
 *   - routeDefineDotID: (Optional) Filter to restrict dots to a specific route definition dot.
 *
 * @returns A promise that resolves with paginated data of route instance dots.
 */
export function getRouteInstanceDotList(params: {
  memberID: string
  routeDefineID?: string
  routeInstanceID: string
  routeDefineDotID?: string
}) {
  return http.get<IPageData<RouteInstanceDot>>('/getRouteInstanceDotList.json', {
    ...params,
  })
}

export interface BeginOneRouteInstance {
  realBeginTime: string
}
/**
 * Begins a route instance.
 *
 * Sends a GET request to initiate the route instance identified by the provided ID.
 *
 * @param params - An object with the following property:
 *   - routeInstanceID: The identifier of the route instance to start.
 * @returns A promise that resolves with the response data, which includes the actual start time of the route instance.
 */
export function beginOneRouteInstance(params: {
  routeInstanceID: string
}) {
  return http.get<IPageData<BeginOneRouteInstance>>('/beginOneRouteInstance.json', {
    ...params,
  })
}
export interface EndOneRouteInstance {
  realEndTime: string
}
/**
 * Ends a route instance.
 *
 * Sends a GET request to terminate the specified route instance and obtain its actual end time.
 *
 * @param params - An object containing the identifier of the route instance to end.
 * @param params.routeInstanceID - The unique identifier of the route instance.
 *
 * @returns A promise that resolves with the end time details of the route instance.
 */
export function endOneRouteInstance(params: {
  routeInstanceID: string
}) {
  return http.get<IPageData<EndOneRouteInstance>>('/endOneRouteInstance.json', {
    ...params,
  })
}
