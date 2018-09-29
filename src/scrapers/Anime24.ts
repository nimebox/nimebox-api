import BaseScraper, { IBaseScraperResponse } from './BaseScraper'

export default class Anime24 extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'http://anime24.pl'
    this.serviceId = 'anime24'
  }

  public async getNews(): Promise<IBaseScraperResponse[]> {
    try {
      const { doc } = await this.api('news.php')

      const obj = {
        title: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a:nth-of-type(2)')],
        url: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a[href]')],
        date: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-date"]')],
        description: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-desc"]')],
        image: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-category-image"] > a > img[src]')],
      }
      return obj.title.map((el, i) => {
        return ({
          title: el.textContent.trim(),
          url: obj.url[i].getAttribute('href'),
          date: obj.date[i].textContent,
          description: obj.description[i].textContent.trim(),
          image: obj.image[i].getAttribute('src'),
        })
      })
    } catch (err) {
      throw err
    }
  }

}
