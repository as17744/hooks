/**
 * @description route config
 */
export type Route = {
  /**
   * @description api route directory, exported functions in the directory will create a api
   */
  baseDir: string
  [key: string]: any
}
