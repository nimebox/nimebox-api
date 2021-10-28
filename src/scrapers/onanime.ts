// TODO: re-write and implement scrapper based on `BaseScraper`
const xray = require('x-ray')()
import got from 'got'
import _ from 'lodash'
import qs from 'qs'
import * as utils from '../utils'

const SERVICE_ID = 'onanime'
const BASE_URL = 'https://on-anime.pl'

const api = got.extend({
  prefixUrl: BASE_URL,
  headers: {
    Accept: 'text/html',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36',
    'Cache-Control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded',
  },
})

const runAndParsePage = async (form): Promise<{ title: string; url: string; description: string; image: string }[]> => {
  const response = await api.post('moduly/anime/ajax.szukaj.php', { body: qs.stringify(form) })
  return new Promise((resolve, reject) => {
    xray(response.body, {
      items: xray('div.ramka > div.tbl > div.tab', [
        {
          title: 'a',
          url: 'a@href',
          description: 'div > h6:nth-of-type(2)',
          image: 'div > div.obrazek@onclick',
        },
      ]),
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      const list = []
      _.forEach(obj.items, (value) => {
        list.push({
          // id: value.url.split('/').pop().toLowerCase(),
          title: value.title.trim(),
          url: `${BASE_URL}/${value.url}/odcinki`,
          description: `${value.description === undefined ? '' : value.description}`,
          image: `${BASE_URL}/${value.image.slice(9, -2)}`,
        })
      })
      resolve(list)
    })
  })
}

// FIXME
const getAnimeList = async (): Promise<{
  serviceId: string
  items: { title: string; url: string; description: string; image: string }[]
}> => {
  let fullList = []
  const form = {
    strona: 1,
    sortuj: 0,
    widok: 1,
    strony: 0,
  }

  const responseFirst = await api.post('moduly/anime/ajax.szukaj.php', { body: qs.stringify(form) }).catch((e) => {
    throw e
  })

  return new Promise((resolve, reject) => {
    xray(responseFirst.body, {
      sites: 'script',
      items: xray('div.ramka > div.tbl > div.tab', [
        {
          title: 'a',
          url: 'a@href',
          description: 'div > h6:nth-of-type(2)',
          image: 'div > div.obrazek@onclick',
        },
      ]),
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      _.forEach(obj.items, (value) => {
        fullList.push({
          // id: value.url.split('/').pop().toLowerCase(),
          title: value.title.trim(),
          url: `${BASE_URL}/${value.url}/odcinki`,
          description: `${value.description === undefined ? '' : value.description}`,
          image: `${BASE_URL}/${value.image.slice(9, -2)}`,
        })
      })
      const maxSiteNumber = parseInt(obj.sites.slice(9, -1), 10)

      const forms = []

      for (let page = 2; page <= maxSiteNumber; page += 1) {
        forms.push({
          strona: page,
          sortuj: 0,
          widok: 1,
          strony: maxSiteNumber,
        })
      }

      const promiseList = []

      _.forEach(forms, (item) => {
        promiseList.push(runAndParsePage(item))
      })

      Promise.all(promiseList)
        .then((rest) => {
          _.forEach(rest, (item) => {
            fullList = _.concat(fullList, item)
          })
          fullList = _.sortBy(fullList, [
            (o) => {
              return o.title
            },
          ])

          resolve({ serviceId: SERVICE_ID, items: fullList })
        })
        .catch((err) => console.error(err))
    })
  })
}

const getAnime = async (
  q: string
): Promise<{ serviceId: string; animeId: string; items: { id: string; title: string; url: string }[] }> => {
  await utils.wait(5000)
  const response = await api.get(`anime/${q}/odcinki`).catch((e) => {
    throw e
  })
  return new Promise((resolve, reject) => {
    xray(response.body, {
      items: xray('#lista_odcinkow > div.tab', [
        {
          title: 'div.tp.tbl > a',
          url: 'div.tp.tbl > div.right > div > a@href',
          epNumber: 'div.tp.tbl:nth-of-type(2)',
        },
      ]),
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      const list = []
      _.forEach(obj.items, (value) => {
        console.log(`url: ${value.url}`)
        list.push({
          id: value.url.split('/').pop().toLowerCase(),
          title: `${value.epNumber.trim()} - ${value.title.trim()}`,
          url: `${value.url}`,
        })
      })

      resolve({ serviceId: SERVICE_ID, animeId: q, items: list })
    })
  })
}
const runAndParsePlayersPage = async (data) => {
  const form = {
    id: data.videoId,
  }

  const response = await api.post('moduly/anime/ajax.online.php', { body: qs.stringify(form) }).catch((e) => {
    throw e
  })
  return new Promise((resolve, reject) => {
    xray(response.body, {
      players: ['iframe@src'],
    })((err, obj) => {
      if (err) {
        reject(err)
      }

      let videoUrl = obj.players[0]

      if (videoUrl.substring(0, 2) === '//') {
        videoUrl = `https:${videoUrl}`
      }

      const splitedDomainPlayer = utils.getDomainName(videoUrl).split('.')
      resolve({
        uid: `${splitedDomainPlayer[splitedDomainPlayer.length - 2].toLowerCase()}_${data.index}`,
        url: videoUrl,
        name: data.name,
      })
    })
  })
}
const getPlayers = async (q, n) => {
  const response = await api.get(`anime/${q}/${n}`).catch((e: Error) => {
    throw e
  })
  return new Promise((resolve, reject) => {
    xray(response.body, {
      items: xray('div.tw', [
        {
          videoId: 'div > a@onclick',
          playerName: 'div > a',
        },
      ]),
    })(async (err, obj) => {
      if (err) {
        reject(err)
      }

      const promiseList = []
      _.forEach(obj.items, (value, index) => {
        promiseList.push(
          runAndParsePlayersPage({
            videoId: value.videoId.slice(8, -2),
            name: value.playerName.replace(new RegExp(/(\(.*\))/, 'g'), '').trim(),
            index,
          })
        )
      })

      Promise.all(promiseList)
        .then((rest) => {
          resolve(rest)
        })
        .catch((err) => console.error(err))
    })
  })
}

export default {
  getAnimeList,
  getAnime,
  getPlayers,
}
