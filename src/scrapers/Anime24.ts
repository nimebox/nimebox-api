import BaseScraper, { IBaseScraperResponse } from './BaseScraper'

export default class Anime24 extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://anime24.pl'
    this.serviceId = 'anime24'
    this.lang = 'pl'
  }

  public async getNews(): Promise<IBaseScraperResponse[]> {
    try {
      const { doc } = await this.api('news')

      const obj = {
        title: [
          ...doc.querySelectorAll(
            'div[class="cell small-12 medium-9"] > h5 > a > span[class="field field--name-title field--type-string field--label-hidden"]'
          )
        ],
        url: [...doc.querySelectorAll('div[class="cell small-12 medium-9"] > h5 > a[href]')],
        date: [
          ...doc.querySelectorAll(
            'div[class="cell small-12 medium-9"] > div[class="teaser-category"] > span[class="teaser-date"]'
          )
        ],
        description: [...doc.querySelectorAll('div[class="cell small-12 medium-9"] > div[class="node__content"]')],
        image: [
          ...doc.querySelectorAll('div[class="cell small-12 medium-3"] > figure[class="teaser-image"] > a > img[src]')
        ]
      }

      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: `${this.baseUrl}/${obj.url[i].getAttribute('href')}`,
          date: obj.date[i].textContent.slice(1, -1),
          description: obj.description[i].textContent.trim(),
          image: obj.image[i].getAttribute('src')
        }
      })
    } catch (err) {
      throw err
    }
  }
}
