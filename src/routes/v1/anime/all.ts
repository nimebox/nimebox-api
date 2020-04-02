import Koa from 'koa'
import { createApp } from '../../..'
import SenpaiScraper from '../../../scrapers/Senpai'
import HorribleSubsScraper from '../../../scrapers/HorribleSubs'
import OkamiSubsScraper from '../../../scrapers/OkamiSubs'
import onanime from '../../../scrapers/onanime'
import { AnimeRespone } from '../../../utils'

const senpai = new SenpaiScraper()
const horriblesubs = new HorribleSubsScraper()
const okamisubs = new OkamiSubsScraper()

async function main(ctx: Koa.Context) {
  let res: AnimeRespone

  switch (ctx.query.provider) {
    case 'onanime':
      res = await onanime.getAnimeList()
      break
    case 'horriblesubs':
      res = {
        serviceId: horriblesubs.serviceId,
        lang: horriblesubs.lang,
        data: await horriblesubs.getAnimeList(),
      }
      break
    case 'okamisubs':
      res = {
        serviceId: okamisubs.serviceId,
        lang: okamisubs.lang,
        data: await okamisubs.getAnimeList(),
      }
      break
    case 'senpai':
    default:
      res = {
        serviceId: senpai.serviceId,
        lang: senpai.lang,
        data: await senpai.getAnimeList(),
      }
  }

  ctx.status = 200
  ctx.body = res
}
export default createApp((app: Koa) => {
  app.use(main)
})
