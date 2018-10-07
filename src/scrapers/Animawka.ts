import BaseScraper, { IBaseScraperResponse, IBasePlayerResponse } from './BaseScraper'

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
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`,
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
          title: el.textContent.replace(/\t|\n/g, ''),
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`,
        })
      })
    } catch (err) {
      throw err
    }
  }

  public async getPlayers(animeTitle: string, episodeNumber: string | number): Promise<IBasePlayerResponse[]> {
    try {
      const { doc } = await this.api(`anime/${animeTitle}/${episodeNumber}`)

      const obj = {
        host: [...doc.querySelectorAll('div[class="card-tabs"] > ul[class="tabs tabs-fixed-width tabs-transparent"] > li[class="tab openPlayer"] > a')],
        players: [...doc.querySelectorAll('div[class="card-tabs"] > ul[class="tabs tabs-fixed-width tabs-transparent"] > li[class="tab openPlayer"][data]')],
      }
      return obj.host.map((el, i) => {
        return ({
          host: el.textContent.trim(),
          player: obj.players[i].getAttribute('data'),
        })
      })
    } catch (err) {
      throw err
    }
  }
}
