/* eslint-disable max-len */
// TODO: find fix for `RequestError: unable to get local issuer certificate`
import BaseScraper, { BaseScraperResponse, BasePlayerResponse } from './BaseScraper'
import utils from '../utils'

export default class SenpaiScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://senpai.eu'
    this.serviceId = 'senpai'
    this.lang = 'pl'
  }

  public async getAnimeList(): Promise<any[]> {
    try {
      const { doc } = await this.api('tv-shows')

      const obj = {
        title: [
          ...doc.querySelectorAll(
            'div[class="tv-shows__inner"] > div > div[class="tv-show__body"] > div[class="tv-show__info"] > div[class="tv-show__info--head"] > a > h3'
          ),
        ],
        url: [...doc.querySelectorAll('div[class="tv-shows__inner"] > div > div[class="tv-show__poster"] > a[href]')],
        image: [
          ...doc.querySelectorAll('div[class="tv-shows__inner"] > div > div[class="tv-show__poster"] > a > img[src]'),
        ],
      }
      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: obj.url[i].getAttribute('href'),
          image: obj.image[i].getAttribute('src'),
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getAnime(animeTitle: string | string[]): Promise<BaseScraperResponse[]> {
    try {
      const parsedAnimeTitle = animeTitle.toString().replace(/\s+/g, '-').toLowerCase()

      const { doc } = await this.api(`tv-show/${encodeURIComponent(parsedAnimeTitle)}`)

      const obj = {
        title: [...doc.querySelectorAll('div[class="episodes__inner"] > div > div[class="episode__body"] > a > h3')],
        url: [...doc.querySelectorAll('div[class="episodes__inner"] > div > div[class="episode__poster"] > a[href]')],
      }

      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: obj.url[i].getAttribute('href'),
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getPlayers(animeTitle: string | string[]): Promise<BasePlayerResponse[]> {
    try {
      const parsedAnimeTitle = animeTitle.toString().replace(/\s+/g, '-').toLowerCase()
      const { doc } = await this.api(`episode/${encodeURIComponent(parsedAnimeTitle)}`)

      const obj = {
        players: [...doc.querySelectorAll('div[class="episode__player"] > p > iframe[src]')],
      }
      return obj.players.map((el) => {
        return {
          host: utils.getDomainName(el.getAttribute('src')),
          player: el.getAttribute('src'),
        }
      })
    } catch (err) {
      throw err
    }
  }
}
