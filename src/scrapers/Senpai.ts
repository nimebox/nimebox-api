/* eslint-disable max-len */
import BaseScraper, { BaseScraperResponse, BasePlayerResponse } from './BaseScraper'

export default class SenpaiScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://senpai.com.pl'
    this.serviceId = 'senpai'
    this.lang = 'pl'
  }

  public async getAnimeList(): Promise<any[]> {
    try {
      const { doc } = await this.api('anime')

      const obj = {
        title: [
          ...doc.querySelectorAll(
            'div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"] > div[class="anime-desc"] > span[class="title anime-title"]'
          ),
        ],
        url: [
          ...doc.querySelectorAll(
            'div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"][href]'
          ),
        ],
        image: [
          ...doc.querySelectorAll(
            'div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"] > img[class="anime-cover"][src]'
          ),
        ],
      }
      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`,
          image: `${this.baseUrl}${obj.image[i].getAttribute('src')}`,
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getAnime(animeTitle: string): Promise<BaseScraperResponse[]> {
    try {
      const { doc } = await this.api(`anime/${encodeURIComponent(animeTitle)}`)

      const obj = {
        title: [
          ...doc.querySelectorAll(
            'div[class="collection row anime-col"] > a[class="collection-item anime-item"] > div[class="anime-number"] > h5'
          ),
        ],
        url: [
          ...doc.querySelectorAll('div[class="collection row anime-col"] > a[class="collection-item anime-item"][href]'),
        ],
      }
      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: `${this.baseUrl}${obj.url[i].getAttribute('href')}`,
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getPlayers(animeTitle: string, episodeNumber: string | number): Promise<BasePlayerResponse[]> {
    try {
      const { doc } = await this.api(
        `anime/${encodeURIComponent(animeTitle)}/${encodeURIComponent(episodeNumber.toString())}`
      )

      const obj = {
        host: [...doc.querySelectorAll('div[class="container"] > ul[class="tabs"] > li[class="tab"] > a')],
        players: [...doc.querySelectorAll('div[class="video-container"] > iframe[src]')],
      }
      return obj.host.map((el, i) => {
        return {
          host: el.textContent.trim(),
          player: obj.players[i].getAttribute('src'),
        }
      })
    } catch (err) {
      throw err
    }
  }
}
