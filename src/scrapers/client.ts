import got from 'got'
import type { ExtendOptions, Got } from 'got'
import { JSDOM } from 'jsdom'

export default async function (url: string, opts?: Got | ExtendOptions) {
  try {
    const config: Got | ExtendOptions = Object.assign({}, opts, { url })

    const gotInstance = got.extend(config)
    const response = await gotInstance(url)

    const jsdom = new JSDOM(response.body)
    return {
      doc: jsdom.window.document,
      res: response.body,
    }
  } catch (err) {
    throw err
  }
}
