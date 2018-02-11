const x = require('x-ray')()
const api = require('../utls/api')
const _ = require('lodash')

const mp4upload = require('../videoPlayers/Mp4UploadCom')

const BASE_URL = 'http://www.senpai.com.pl'

const getAnimes = async () => {
  const response = await api.get(`${BASE_URL}/anime`)
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

const getAnime = async (q) => {
  const response = await api.get(`${BASE_URL}/anime/${q}`)
  return new Promise((resolve, reject) => {
    x(response.data, {
      number: ['div[class="collection row anime-col"] > a[class="collection-item anime-item"] > div[class="anime-number"] > h5'],
      url: ['div[class="collection row anime-col"] > a[class="collection-item anime-item"]@href'],
      description: ['div[class="collection row anime-col"] > a[class="collection-item anime-item"] > div[class="anime-desc"] > span[class="grey-text text-lighten-1"]']
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = _.compact(obj.number).map((el, i) => {
        return ({
          number: el,
          url: BASE_URL + obj.url[i],
          description: obj.description[i]
        })
      })
      resolve(list)
    })
  })
}

const getAnimePlayers = async (q, n) => {
  const response = await api.get(`${BASE_URL}/anime/${q}/${n}`)
  return new Promise((resolve, reject) => {
    x(response.data, {
      host: ['div[class="container"] > ul[class="tabs"] > li[class="tab"] > a'],
      player1: 'div[class="container"] > div[id="pl1"] > div[class="video-container"] > iframe@src',
      player2: 'div[class="container"] > div[id="pl2"] > div[class="video-container"] > iframe@src',
      player3: 'div[class="container"] > div[id="pl3"] > div[class="video-container"] > iframe@src'
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      const player1 = await mp4upload.getVideo(obj.player1)
      const pls = [
        player1.url,
        obj.player2,
        obj.player3
      ]

      const list = pls.map((el, i) => {
        return ({
          host: obj.host[i],
          player: el
        })
      })
      resolve(list)
    })
  })
}

module.exports = {
  getAnimes,
  getAnime,
  getAnimePlayers
}
