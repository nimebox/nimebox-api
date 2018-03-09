const x = require('x-ray')()
const axios = require('axios')
const api = axios.create({
  headers: {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36'
  }
})

const _ = require('lodash')

const mp4upload = require('../videoplayers/Mp4UploadCom')

const utils = require('../utls/utils')

const SERVICE_ID = 'senpai'
const BASE_URL = 'http://www.senpai.com.pl'

const getAnimes = async () => {
  try {
    const response = await api.get(`${BASE_URL}/anime`)
    let items = null
    x(response.data, {
      items: x('a.collection-item.anime-item', [{
        title: 'div.anime-desc > span.title.anime-title',
        url: '@href',
        description: 'div.anime-desc > span.grey-text.text-lighten-1',
        image: 'img.anime-cover@src'
      }])
    })((err, obj) => {
      if (err) {
        throw err
      }
      items = obj.items
    })

    const list = []

    _.forEach(items, (value) => {
      list.push({
        // id: value.url.split('/').pop().toLowerCase(),
        title: value.title.trim(),
        url: `${BASE_URL}/${value.url}`,
        description: `${value.description}`,
        image: `${BASE_URL}/${value.image}`
      })
    })

    return {serviceId: SERVICE_ID, list: list}
  } catch (err) {
    console.log(err)
  }
}

const getAnime = async (q) => {
  const response = await api.get(`${BASE_URL}/anime/${q}`)
  return new Promise((resolve, reject) => {
    x(response.data, {
      items: x('a.collection-item.anime-item', [{
        number: 'div.anime-number > h5',
        url: '@href',
        description: 'div.anime-desc > span.grey-text.text-lighten-1'
      }])
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = []

      _.forEach(obj.items, (value) => {
        list.push({
          id: value.url.split('/').pop().toLowerCase(),
          number: value.number.trim(),
          url: `${BASE_URL}/${value.url}`,
          description: `${value.description}`
        })
      })

      resolve({serviceId: SERVICE_ID, animeId: q, list: list})
    })
  })
}

const getAnimePlayers = async (q, n) => {
  const response = await api.get(`${BASE_URL}/anime/${q}/${n}`)
  return new Promise((resolve, reject) => {
    x(response.data, {
      host: ['div[class="container"] > ul[class="tabs"] > li[class="tab"] > a'],
      players: ['div[class="video-container"] > iframe@src']
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      const list = _.map(_.zip(obj.host, obj.players), (objZiped) => {
        console.log(objZiped)
        return ({
          host: objZiped[0],
          player: objZiped[1]
        })
      })

      const returnList = []

      const toDecode = []

      _.forEach(list, (item, index) => {
        const domain = utils.getDomainName(item.player)
        if (domain === 'mp4upload.com') {
          toDecode.push(item)
        } else {
          returnList.push(item)
        }
      })

      // TODO to change !!
      if (toDecode.length === 1) {
        const result = await mp4upload.getVideo(toDecode[0].player)
        returnList.push({
          host: toDecode[0].host,
          player: result.url
        })
      }

      resolve(returnList)
    })
  })
}

module.exports = {
  getAnimes,
  getAnime,
  getAnimePlayers
}
