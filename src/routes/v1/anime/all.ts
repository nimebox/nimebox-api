import Koa from 'koa'
import { createApp } from '../../..'
import SenpaiScraper from '../../../scrapers/Senpai'
import onanime from '../../../scrapers/onanime'

const senpai = new SenpaiScraper()

export type AnimeRespone = { serviceId?: string; data?: any[] }

async function main(ctx: Koa.Context) {
  let res: AnimeRespone

  switch (ctx.query.provider) {
    case 'onanime':
      res = await onanime.getAnimes()
      break
    case 'senpai':
    default:
      res = {
        serviceId: senpai.serviceId,
        data: await senpai.getAnimeList()
      }
  }

  ctx.status = 200
  ctx.body = res
}
export default createApp((app: Koa) => {
  app.use(main)
})
