import Koa from 'koa'
import { createApp } from '../../..'
import AnimeZoneScraper from '../../../scrapers/Animezone'
import { AnimeRespone } from '../../../utils'

const animezone = new AnimeZoneScraper()

async function main(ctx: Koa.Context) {
  if (!ctx.query || !ctx.query.q || !ctx.query.n) {
    throw new Error('Missing q and n query')
  } else {
    let res: AnimeRespone
    switch (ctx.query.provider) {
      case 'animezone':
        try {
          res = {
            serviceId: animezone.serviceId,
            lang: animezone.lang,
            data: await animezone.getPlayers(ctx.query.q, ctx.query.n),
          }
          ctx.status = 200
          ctx.body = res
        } catch (error) {
          ctx.throw(error)
        }
        break
    }
  }
}

export default createApp((app: Koa) => {
  app.use(main)
})
