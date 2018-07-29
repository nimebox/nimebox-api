const x = require('x-ray')()
import axios from 'axios'
const api = axios.create({
  headers: {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36'
  }
})
import _ from 'lodash'

const BASE_URL = 'http://anime24.pl'

export default async () => {
  const response = await api.get(BASE_URL + '/news.php')
  return new Promise((resolve, reject) => {
    x(response.data, {
      title: ['div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a'],
      url: ['div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-title"] > a@href'],
      date: ['div[class="news-module"] > div[class="news"] > div[class="news-info-bar"] > div[class="news-title-bar float-left"] > div[class="news-date"]'],
      description: ['div[class="news-module"] > div[class="news"] > div[class="news-desc"]'],
      image: ['div[class="news-module"] > div[class="news"] > div[class="news-category-image"] > a > img@src']
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const news = _.compact(obj.title).map((el, i) => {
        return ({
          title: el,
          url: _.compact(obj.url)[i],
          date: _.compact(obj.date)[i],
          description: _.trim(_.compact(obj.description)[i]),
          image: _.compact(obj.image)[i]
        })
      })
      resolve(news)
    })
  })
}
