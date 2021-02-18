/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios, { AxiosRequestConfig } from 'axios'
import { JSDOM } from 'jsdom'

export default async function (url: string, opts?: AxiosRequestConfig) {
  try {
    const config = Object.assign({}, opts, { url })
    const response = await axios(config)
    const jsdom = new JSDOM(response.data)
    return {
      doc: jsdom.window.document,
      res: response.data,
    }
  } catch (err) {
    throw err
  }
}
