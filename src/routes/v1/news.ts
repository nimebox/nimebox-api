import Koa from 'koa'
import { createApp } from '../..'
import Anime24 from '../../scrapers/Anime24'

async function main(ctx: Koa.Context) {
  const animeNews = new Anime24()
  const res = await animeNews.getNews()

  ctx.status = 200
  ctx.body = {
    serviceId: animeNews.serviceId,
    data: res
  }
}

export default createApp((app: Koa) => {
  app.use(main)
})
