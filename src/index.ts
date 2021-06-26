import Koa from 'koa'
import pinoLogger from 'koa-pino-logger'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import { multistream } from 'pino-multi-stream'

export function createApp(main: (app: Koa) => any) {
  const app = new Koa()

  app.use(
    pinoLogger({
      name: 'nimebox-api',
      level: 'info',
      prettyPrint: process.env.NODE_ENV == 'development' ? { colorize: true } : false,
      /**
       * Log to different streams
       * @see {@link https://github.com/pinojs/pino/blob/master/docs/help.md#log-to-different-streams}
       */
      stream: multistream([
        { level: 'debug', stream: process.stdout },
        { level: 'error', stream: process.stderr },
        { level: 'fatal', stream: process.stderr },
      ]),
      /**
       * Avoid Message Conflict
       * @see {@link https://github.com/pinojs/pino/blob/master/docs/help.md#avoid-message-conflict}
       */
      hooks: {
        logMethod(inputArgs, method) {
          if (inputArgs.length === 2 && inputArgs[0].msg) {
            inputArgs[0].originalMsg = inputArgs[0].msg
          }
          return method.apply(this, inputArgs)
        },
      },
    })
  )
  app.use(helmet())
  app.use(bodyParser())
  app.use(async (_ctx: Koa.Context, next) => {
    try {
      await next()
    } catch (err) {
      err.status = err.statusCode || err.status || 500
      throw err
    }
  })

  main(app)

  return app.callback()
}
