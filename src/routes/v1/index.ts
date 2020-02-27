import Koa from 'koa'
import { createApp } from '../..'

async function main(ctx: Koa.Context) {
  ctx.status = 200
  ctx.body = {
    message: `Api say Hello`
  }
}

export default createApp((app: Koa) => {
  app.use(main)
})
