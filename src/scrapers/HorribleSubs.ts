import BaseScraper, { BaseScraperResponse } from './BaseScraper'

const titleRegex = /<\/span>([^<>]+) -\s*<strong>([0-9a-zA-Z]+)<\/strong>/g

export default class HorribleSubsScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://horriblesubs.info'
    this.serviceId = 'horriblesubs'
    this.lang = 'en'
  }

  public async getAnimeList(): Promise<any[]> {
    try {
      const { doc, res } = await this.api('api.php?method=getlatest')

      const obj = {
        title: [
          ...(function() {
            let titleArray
            const result = []
            while ((titleArray = titleRegex.exec((res as unknown) as string)) !== null) {
              result.push(titleArray)
            }
            return result
          })()
        ],
        url: [...doc.querySelectorAll('ul li a[href]')]
      }
      return obj.title.map((el, i) => {
        return {
          title: el[1].trim(),
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getAnime(animeTitle: string): Promise<BaseScraperResponse[]> {
    try {
      const { doc, res } = await this.api(`api.php?method=search&value=${encodeURIComponent(animeTitle)}`)

      const obj = {
        title: [
          ...(function() {
            let titleArray
            const result = []
            while ((titleArray = titleRegex.exec((res as unknown) as string)) !== null) {
              result.push(titleArray)
            }
            return result
          })()
        ],
        url: [...doc.querySelectorAll('ul li a[href]')]
      }
      return obj.title.map((el, i) => {
        return {
          title: el[2].trim(),
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`
        }
      })
    } catch (err) {
      throw err
    }
  }
}
