const x = require('x-ray')()
const axios = require('axios')
const _ = require('lodash')

const api = axios.create({
  withCredentials: true
})
const BASE_URL = 'http://anime24.pl'

const news = async () => {
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
          description: _.compact(obj.description)[i],
          image: _.compact(obj.image)[i]
        })
      })
      resolve(news)
    })
  })
}

module.exports = {
  news
}
