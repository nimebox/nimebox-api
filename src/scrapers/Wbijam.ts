/* eslint-disable max-len */
import BaseScraper, { BaseScraperResponse, BasePlayerResponse } from './BaseScraper'
import * as utils from '../utils'

export default class WbijamScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'wbijam.pl'
    this.serviceId = 'wbijam'
    this.lang = 'pl'
  }

  // TODO: fetch series from https://inne.wbijam.pl/ and merge
  public async getAnimeList(): Promise<any[]> {
    try {
      const { doc } = await this.api(`https://${this.baseUrl}`, null, true)

      const obj = {
        title: [...doc.querySelectorAll('div[class="top-portal"] > a')],
        url: [...doc.querySelectorAll('div[class="top-portal"] > a[href]')],
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

  // TODO: add support for more than 1 anime season
  public async getAnime(animeTitle: string | string[]): Promise<BaseScraperResponse[]> {
    try {
      const parsedAnimeTitle = animeTitle.toString()

      const { doc } = await this.api(
        `https://${encodeURIComponent(parsedAnimeTitle)}.${this.baseUrl}/pierwsza_seria.html`,
        null,
        true
      )

      const obj = {
        title: [...doc.querySelectorAll('table[class="lista"] > tbody > tr[class="lista_hover"] > td:nth-of-type(1) > a')],
        url: [
          ...doc.querySelectorAll('table[class="lista"] > tbody > tr[class="lista_hover"] > td:nth-of-type(1) > a[href]'),
        ],
      }

      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: `https://${encodeURIComponent(parsedAnimeTitle)}.${this.baseUrl}/${obj.url[i].getAttribute('href')}.html`,
        }
      })
    } catch (err) {
      throw err
    }
  }

  // TODO: find a way to fetch players
  public async getPlayers(animeUrl: string | string[]): Promise<BasePlayerResponse[]> {
    try {
      const parsedAnimeUrl = animeUrl.toString()
      const parsedDomainName = utils.getDomainName(parsedAnimeUrl)

      const { doc } = await this.api(parsedAnimeUrl, null, true)

      const obj = {
        host: [...doc.querySelectorAll('table[class="lista"] > tbody > tr[class="lista_hover"] > td:nth-of-type(3)')],
        players: [
          ...doc.querySelectorAll('table[class="lista"] > tbody > tr[class="lista_hover"] > td:nth-of-type(5) > span[rel]'),
        ],
      }
      return obj.host.map((el, i) => {
        return {
          host: el.textContent.trim(),
          player: `https://${parsedDomainName}/odtwarzacz-${obj.players[i].getAttribute('rel')}.html`,
        }
      })
    } catch (err) {
      throw err
    }
  }
}
