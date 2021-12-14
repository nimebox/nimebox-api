import Koa from 'koa'
import { createApp } from '../../..'
import OkamiSubsScraper from '../../../scrapers/OkamiSubs'
import { AnimeRespone } from '../../../utils'

const okamisubs = new OkamiSubsScraper()

async function main(ctx: Koa.Context) {
  let res: AnimeRespone

  switch (ctx.query.provider) {
    default:
    case 'okamisubs':
      try {
        res = {
          serviceId: okamisubs.serviceId,
          lang: okamisubs.lang,
          data: await okamisubs.getAnimeList(),
        }
        ctx.status = 200
        ctx.body = res
      } catch (error) {
        ctx.throw(error)
      }
      break
  }
}
export default createApp((app: Koa) => {
  app.use(main)
})
