import Koa from 'koa'
import { createApp } from '../../..'
import SenpaiScraper from '../../../scrapers/Senpai'
import onanime from '../../../scrapers/onanime'
import AnimeZoneScraper from '../../../scrapers/Animezone'
import HorribleSubsScraper from '../../../scrapers/HorribleSubs'
import { AnimeRespone } from '../../../utils'

const senpai = new SenpaiScraper()
const animezone = new AnimeZoneScraper()
const horriblesubs = new HorribleSubsScraper()

async function main(ctx: Koa.Context) {
  if (!ctx.query || !ctx.query.q) {
    throw new Error('Missing q param')
  } else {
    let res: AnimeRespone
    switch (ctx.query.provider) {
      case 'onanime':
        res = await onanime.getAnime(ctx.query.q)
        break
      case 'animezone':
        res = {
          serviceId: animezone.serviceId,
          data: await animezone.getAnime(ctx.query.q),
        }
        break
      case 'horriblesubs':
        res = {
          serviceId: horriblesubs.serviceId,
          data: await horriblesubs.getAnime(ctx.query.q),
        }
        break
      case 'senpai':
      default:
        res = {
          serviceId: senpai.serviceId,
          data: await senpai.getAnime(ctx.query.q),
        }
    }
    ctx.status = 200
    ctx.body = res
  }
}

export default createApp((app: Koa) => {
  app.use(main)
})
