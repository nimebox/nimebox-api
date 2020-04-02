/* eslint-disable max-len */
import BaseScraper, { BaseScraperResponse, BasePlayerResponse } from './BaseScraper'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'
import { JSDOM } from 'jsdom'

const cookieJar = new tough.CookieJar()

axiosCookieJarSupport(axios)

const config = {
  jar: cookieJar,
  withCredentials: true,
}

const sessionApi = axios.create(config)

export default class AnimeZoneScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://www.animezone.pl'
    this.serviceId = 'animezone'
    this.lang = 'pl'
  }

  public async getAnime(animeTitle: string): Promise<BaseScraperResponse[]> {
    try {
      const { doc } = await this.api(`anime/${encodeURIComponent(animeTitle.split(' ').join('-')).toLowerCase()}`)

      const obj = {
        title: [
          ...doc.querySelectorAll(
            'table[class="table table-bordered table-striped table-hover episodes"] > tbody > tr > td[class="episode-title"]'
          ),
        ],
        url: [
          ...doc.querySelectorAll(
            'table[class="table table-bordered table-striped table-hover episodes"] > tbody > tr > td[class="text-center"] > a[href]'
          ),
        ],
      }

      return obj.title.map((el, i) => {
        return {
          title: el.textContent.trim(),
          url: `${this.baseUrl}/${obj.url[i].getAttribute('href')}`,
        }
      })
    } catch (err) {
      throw err
    }
  }

  public async getPlayers(animeTitle: string, episodeNumber: string | number): Promise<BasePlayerResponse[] | any> {
    try {
      const path = `odcinek/${encodeURIComponent(animeTitle.split(' ').join('-')).toLowerCase()}/${encodeURIComponent(
        episodeNumber.toString()
      )}`
      const html = await sessionApi.get(`${this.baseUrl}/${path}`)
      const jsdom = new JSDOM(html.data)
      const doc = jsdom.window.document.body

      const obj = {
        host: [
          ...doc.querySelectorAll(
            'table[class="table table-bordered table-striped table-hover episode"] > tbody > tr > td:first-of-type'
          ),
        ],
        players: [
          ...doc.querySelectorAll(
            'table[class="table table-bordered table-striped table-hover episode"] > tbody > tr > td:nth-child(4) > button[class="btn btn-xs btn-success play"]'
          ),
        ],
      }

      return obj.host.map((el, i) => {
        return {
          host: el.textContent.trim(),
          player: obj.players[i].attributes[1].textContent,
        }
      })
    } catch (err) {
      throw err
    }
  }
}
