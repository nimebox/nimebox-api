import BaseScraper from './BaseScraper'
import _ from 'lodash'

export default class Anime24 extends BaseScraper {
  constructor () {
    this._baseUrl = 'http://anime24.pl'
    this._serviceId = 'anime24'
    super(this._baseUrl, this._serviceId)
  }

  public async getNews (): Promise<object[]> {
    try {
      const { doc } = await this.api('news.php', this.config)
      const obj = {
        title: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a')],
        url: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a@href')],
        date: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-date"]')],
        description: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-desc"]')],
        image: [...doc.querySelectorAll('div[class="news-module"] > div[class="news"] > div[class="news-category-image"] > a > img@src')]
      }
      const news = _.compact(obj.title).map((el, i) => {
        return ({
          title: el.textContent,
          url: _.compact(obj.url)[i].textContent,
          date: _.compact(obj.date)[i].textContent,
          description: _.trim(_.compact(obj.description)[i].textContent),
          image: _.compact(obj.image)[i].textContent
        })
      })

      return news
    } catch (err) {
      return err
    }
  }

}
