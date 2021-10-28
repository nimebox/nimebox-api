import Koa from 'koa'
import SenpaiScraper from '../../../scrapers/Senpai'
import { createApp } from '../../..'
import OkamiSubsScraper from '../../../scrapers/OkamiSubs'
import { AnimeRespone } from '../../../utils'

const okamisubs = new OkamiSubsScraper()
const senpai = new SenpaiScraper()

async function main(ctx: Koa.Context) {
  let res: AnimeRespone

  switch (ctx.query.provider) {
    default:
    case 'senpai':
      try {
        res = {
          serviceId: senpai.serviceId,
          lang: senpai.lang,
          data: await senpai.getAnimeList(),
        }
        ctx.status = 200
        ctx.body = res
      } catch (error) {
        ctx.throw(error)
      }
      break
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
