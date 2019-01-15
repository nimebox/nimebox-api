import BaseScraper, { IBaseScraperResponse } from './BaseScraper'

export default class AnimeZoneScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://www.animezone.pl'
    this.serviceId = 'animezone'
  }

  public async getAnime(animeTitle: string): Promise<IBaseScraperResponse[]> {
    try {
      const { doc } = await this.api(`odcinki/${encodeURIComponent(animeTitle.split(' ').join('-')).toLowerCase()}`)

      const obj = {
        title: [...doc.querySelectorAll('table[class="table table-bordered table-striped table-hover episodes"] > tbody > tr > td[class="episode-title"]')],
        url: [...doc.querySelectorAll('table[class="table table-bordered table-striped table-hover episodes"] > tbody > tr > td[class="text-center"] > a[href]')],
      }
      return obj.title.map((el, i) => {
        return ({
          title: el.textContent.trim(),
          url: `${this.baseUrl}/${obj.url[i].getAttribute('href')}`,
        })
      })
    } catch (err) {
      throw err
    }
  }

}
