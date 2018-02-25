const xray = require('x-ray')()
const axios = require('axios')
const _ = require('lodash')
const qs = require('qs')

const utils = require('../utls/utils')

const BASE_URL = 'https://on-anime.pl'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded'
  }
})

const getAnimes = async () => {
  var fullList = []
  const form = {
    strona: 1,
    sortuj: 0,
    widok: 1,
    strony: 0
  }

  const responseFirst = await api.post('/moduly/anime/ajax.szukaj.php', qs.stringify(form))

  return new Promise((resolve, reject) => {
    xray(responseFirst.data, {
      sites: 'script',
      items: xray('div.ramka > div.tbl > div.tab', [{
        title: 'a',
        url: 'a@href',
        description: 'div > h6:nth-of-type(2)',
        image: 'div > div.obrazek@onclick'
      }])
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      _.forEach(obj.items, (value) => {
        fullList.push({
          id: value.url.split('/').pop().toLowerCase(),
          title: value.title.trim(),
          url: `${BASE_URL}/${value.url}/odcinki`,
          description: `${value.description === undefined ? '' : value.description}`,
          image: `${BASE_URL}/${value.image.slice(9, -2)}`
        })
      })
      const maxSiteNumber = parseInt(obj.sites.slice(9, -1))

      const forms = []

      for (let page = 2; page <= maxSiteNumber; page++) {
        forms.push({
          strona: page,
          sortuj: 0,
          widok: 1,
          strony: maxSiteNumber
        })
      }

      const promiseList = []

      _.forEach(forms, (item) => {
        promiseList.push(runAndParsePage(item))
      })

      Promise.all(promiseList).then((rest) => {
        _.forEach(rest, (item) => {
          fullList = _.concat(fullList, item)
        })
        resolve(fullList)
        fullList = _.sortBy(fullList, [(o) => { return o.title }])
      })
    })
  })
}

const runAndParsePage = async (form) => {
  const response = await api.post('/moduly/anime/ajax.szukaj.php', qs.stringify(form))
  return new Promise((resolve, reject) => {
    xray(response.data, {
      items: xray('div.ramka > div.tbl > div.tab', [{
        title: 'a',
        url: 'a@href',
        description: 'div > h6:nth-of-type(2)',
        image: 'div > div.obrazek@onclick'
      }])
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = []
      _.forEach(obj.items, (value) => {
        list.push({
          id: value.url.split('/').pop().toLowerCase(),
          title: value.title.trim(),
          url: `${value.url}/odcinki`,
          description: `${value.description === undefined ? '' : value.description}`,
          image: `${BASE_URL}/${value.image.slice(9, -2)}`
        })
      })
      resolve(list)
    })
  })
}

const getAnime = async (q) => {
  const response = await api.get(`/anime/${q}/odcinki`)
  return new Promise((resolve, reject) => {
    xray(response.data, {
      items: xray('#lista_odcinkow > div.tab', [{
        title: 'div.tp.tbl > a',
        url: 'div.tp.tbl > div.right > div > a@href',
        epNumber: 'div.tp.tbl:nth-of-type(2)'
      }])
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = []
      _.forEach(obj.items, (value) => {
        list.push({
          id: value.url.split('/').pop().toLowerCase(),
          title: `${value.epNumber.trim()} - ${value.title.trim()}`,
          url: `${value.url}`
        })
      })

      resolve(list)
    })
  })
}

const getAnimePlayers = async (q, n) => {
  const response = await api.get(`/anime/${q}/${n}`)
  return new Promise((resolve, reject) => {
    xray(response.data, {
      items: xray('div.tw', [{
        videoId: 'div > a@onclick',
        playerName: 'div > a'
      }])
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      const promiseList = []
      _.forEach(obj.items, (value, index) => {
        promiseList.push(runAndParsePlayersPage({
          videoId: value.videoId.slice(8, -2),
          name: value.playerName.replace(new RegExp(/(\(.*\))/, 'g'), '').trim(),
          index: index
        }))
      })

      Promise.all(promiseList).then((rest) => {
        resolve(rest)
      })
    })
  })
}

const runAndParsePlayersPage = async (data) => {
  const form = {
    id: data.videoId
  }

  const response = await api.post('/moduly/anime/ajax.online.php', qs.stringify(form))
  return new Promise((resolve, reject) => {
    xray(response.data, {
      players: ['iframe@src']
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      let videoUrl = obj.players[0]

      if (videoUrl.substring(0, 2) === '//') {
        videoUrl = 'https:' + videoUrl
      }

      const splitedDomainPlayer = utils.getDomainName(videoUrl).split('.')
      resolve({
        uid: `${splitedDomainPlayer[splitedDomainPlayer.length - 2].toLowerCase()}_${data.index}`,
        url: videoUrl,
        name: data.name
      })
    })
  })
}

module.exports = {
  getAnimes,
  getAnime,
  getAnimePlayers
}
