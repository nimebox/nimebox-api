/* eslint-disable max-len */
import BaseScraper, { BaseScraperResponse, BasePlayerResponse } from './BaseScraper'
import * as utils from '../utils'

export default class SenpaiScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://senpai.eu'
    this.serviceId = 'senpai'
    this.lang = 'pl'
  }

  private parseTitle(title: string | string[]): string {
    return encodeURIComponent(title.toString().replace(/\s+/g, '-').toLowerCase())
  }

  public async getAnimeList(): Promise<any[]> {
    try {
      const { doc } = await this.api('anime/list-mode')

      const obj = {
        title: [...doc.querySelectorAll('div[class="soralist"] > div[class="blix"] > ul > li > a')],
        url: [...doc.querySelectorAll('div[class="soralist"] > div[class="blix"] > ul > li > a[href]')],
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
  // FIXME
  public async getAnime(animeTitle: string | string[]): Promise<BaseScraperResponse[]> {
    try {
      const parsedAnimeTitle = this.parseTitle(animeTitle)

      const { doc } = await this.api(`tv-show/${parsedAnimeTitle}`)

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
  // FIXME
  public async getPlayers(animeTitle: string | string[]): Promise<BasePlayerResponse[]> {
    try {
      const parsedAnimeTitle = animeTitle
      const { doc } = await this.api(`episode/${parsedAnimeTitle}`)

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
