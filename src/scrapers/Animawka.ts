import BaseScraper, { IBaseScraperResponse } from './BaseScraper'

export default class Animawka extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://animawka.pl'
    this.serviceId = 'animawka'
  }

  public async getAnimeList(): Promise<IBaseScraperResponse[]> {
    try {
      const { doc } = await this.api('anime')

      const obj = {
        title: [...doc.querySelectorAll('div[class="container"] > div[class="row"] > div[class="col s12"] > div[class="card medium hide-on-large-only"] > div[class="card-image waves-effect waves-block waves-light"] > span[class="card-title boldtitle activator"]')],
        url: [...doc.querySelectorAll('div[class="container"] > div[class="row"] > div[class="col s12"] > div[class="card medium hide-on-large-only"] > div[class="card-action"] > a[href]')],
        image: [...doc.querySelectorAll('div[class="container"] > div[class="row"] > div[class="col s12"] > div[class="card medium hide-on-large-only"] > div[class="card-image waves-effect waves-block waves-light"] > img[src]')],
      }
      return obj.title.map((el, i) => {
        return ({
          title: el.textContent.trim(),
          url: obj.url[i].getAttribute('href'),
          image: obj.image[i].getAttribute('src'),
        })
      })
    } catch (err) {
      throw err
    }
  }

  public async getAnime(animeTitle: string): Promise<IBaseScraperResponse[]> {
    try {
      const { doc } = await this.api(`anime/${animeTitle}`)

      const obj = {
        title: [...doc.querySelectorAll('div[class="col s12 m6"] > div[class="card"] > div[class="collection"] > a[class="collection-item black-text"]')],
        url: [...doc.querySelectorAll('div[class="col s12 m6"] > div[class="card"] > div[class="collection"] > a[class="collection-item black-text"][href]')],
      }
      return obj.title.map((el, i) => {
        return ({
          title: el.textContent.trim(),
          url: el.getAttribute('href'),
        })
      })
    } catch (err) {
      throw err
    }
  }

}
