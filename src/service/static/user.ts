import { http } from '@/utils/http'

/**
 * Updates the user's associated property ID.
 *
 * Sends an HTTP GET request to the `/updateMyMemberPropertyID` endpoint using the provided property identifier.
 *
 * @param propertyID - The unique identifier of the property to be associated with the user.
 * @returns The response from the HTTP GET request.
 */
function updateMyMemberPropertyID(propertyID: string) {
  return http.get('/updateMyMemberPropertyID', { propertyID })
}

/**
 * Retrieves a list of properties available to the user.
 *
 * Sends an HTTP GET request to the `/getPropertyList` endpoint using a preset application ID.
 *
 * @returns A promise that resolves with the list of properties.
 */
function getPropertyList() {
  return http.get('/getPropertyList', { applicationID: APPLICATIONID })
}

/**
 * Updates the user's nickname.
 *
 * Sends an HTTP GET request to the `/updateMyMemberShortname` endpoint with the provided nickname.
 *
 * @param shortName - The new nickname for the user.
 *
 * @returns A promise resolving with the server response after updating the nickname.
 *
 * @example
 * updateMyMemberShortname("newNickname")
 */
function updateMyMemberShortname(shortName: string) {
  return http.get('/updateMyMemberShortname', { shortName })
}

/**
 * Updates the user's avatar image.
 *
 * Sends an HTTP GET request to the "updateMyMemberAvatar.json" endpoint with the provided avatar URL to update the user's profile avatar.
 *
 * @param avatarUR - The URL of the new avatar image.
 */
function updateMyMemberAvatar(avatarUR: string) {
  return http.get('updateMyMemberAvatar.json', { avatarUR })
}

/**
 * Uploads a single file to Qiniu and retrieves its URL.
 *
 * Sends an HTTP GET request to the `uploadOneFileToQiniu.json` endpoint using the specified file bucket ID.
 *
 * @param fileBucketID - The identifier of the file bucket used for the file upload.
 * @returns A promise that resolves with the URL of the uploaded file.
 */
function uploadOneFileToQiniu(fileBucketID: string) {
  return http.get('uploadOneFileToQiniu.json', { fileBucketID })
}

export {
  getPropertyList,
  updateMyMemberAvatar,
  updateMyMemberPropertyID,
  updateMyMemberShortname,
  uploadOneFileToQiniu,
}
