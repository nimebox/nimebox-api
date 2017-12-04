const x = require('x-ray')()
const axios = require('axios')
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support')
const tough = require('tough-cookie')
const _ = require('lodash')
const cookieJar = new tough.CookieJar()
axiosCookieJarSupport(axios)

const api = axios.create({
  jar: cookieJar,
  withCredentials: true
})
const BASE_URL = 'http://www.senpai.com.pl'

const animeList = async () => {
  const response = await api.get(BASE_URL + '/anime')
  return new Promise((resolve, reject) => {
    x(response.data, {
      title: ['div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"] > div[class="anime-desc"] > span[class="title anime-title"]'],
      url: ['div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"]@href'],
      description: ['div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"] > div[class="anime-desc"] > span[class="grey-text text-lighten-1"]'],
      image: ['div[class="collection row anime-col"] > a[class="collection-item anime-item col l6 m6 s12"] > img[class="anime-cover"]@src']
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = _.compact(obj.title).map((el, i) => {
        return ({
          title: el,
          url: BASE_URL + obj.url[i],
          description: obj.description[i],
          image: BASE_URL + obj.image[i]
        })
      })
      resolve(list)
    })
  })
}

module.exports = {
  animeList
}
