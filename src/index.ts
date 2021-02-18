import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'

export function createApp(main: (app: Koa) => any) {
  const app = new Koa()

  app.use(logger())
  app.use(helmet())
  app.use(bodyParser())
  app.use(async (ctx: Koa.Context, next) => {
    ctx.res.statusCode = 200
    try {
      await next()
    } catch (err) {
      console.error(err)
      throw err
    }
  })

  main(app)

  return app.callback()
}
