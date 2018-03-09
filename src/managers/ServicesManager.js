const Loki = require('lokijs')
const _ = require('lodash')
const schedule = require('node-schedule')
// const Queue = require('promise-queue')

const senpai = require('../scrapers/senpai')
const onanime = require('../scrapers/onanime')

class ServicesManager {
  constructor () {
    // Queue.configure(require('vow').Promise)

    // this.queue = new Queue(2, Infinity)

    this.db = new Loki('database.json', { env: 'NODEJS', verbose: true })
    this.animeList = this.db.addCollection('animeList', { unique: ['serviceId'], autoupdate: true })
    this.episodeList = this.db.addCollection('episodeList', { unique: ['animeId'], autoupdate: true })
    this.init()
  }

  async init () {
    const self = this
    await this.loadAnimeData()
    //  await this.loadAnimeEpisodesData()

    this.animeListSchedule = schedule.scheduleJob('*/1 * * * *', () => {
      console.log('Update anime lists for all services')
      self.loadAnimeData()
    })

    // this.episodeListSchedule = schedule.scheduleJob('*/1 * * * *', () => {
    //   console.log('Update episode lists for all animes')
    //   self.loadAnimeEpisodesData()
    // })
  }

  async loadAnimeData () {
    const promiseList = [onanime.getAnimes(), senpai.getAnimes()]

    Promise.all(promiseList).then((rest) => {
      _.forEach(rest, (item) => {
        this.insertOrUpdateAnimeByid(item.serviceId, item.list)
      })
    })
  }

  async loadAnimeEpisodesData () {
    const animePromiseList = []
    _.forEach(this.animeList.chain().data(), (service) => {
      _.forEach(service.list, (anime) => {
        switch (service.serviceId) {
          case 'onanime':
            console.log(`anime: ${anime.id} getting from oanime`)
            animePromiseList.push(onanime.getAnime(anime.id))
            break

          case 'senpai':
            console.log(`anime: ${anime.id} getting from senpai`)
            animePromiseList.push(senpai.getAnime(anime.id))
            break
        }
      })
    })

    Promise.all(animePromiseList).then((rest) => {
      _.forEach(rest, (item) => {
        this.insertOrUpdateEpisodeByid(item.serviceId, item.animeId, item.list)
      })
    })
  }

  insertOrUpdateAnimeByid (serviceId, data) {
    let old = this.animeList.findObject({serviceId: serviceId})
    if (old === null) {
      this.animeList.insert({
        serviceId: serviceId,
        list: data
      })
    } else {
      old.list = data
      this.animeList.update(old)
    }
  }

  insertOrUpdateEpisodeByid (serviceId, animeId, data) {
    let old = this.episodeList.findObject({animeId: animeId})
    if (old === null) {
      this.episodeList.insert({
        serviceId: serviceId,
        animeId: animeId,
        list: data
      })
    } else {
      old.list = data
      this.episodeList.update(old)
    }
  }
}

const servicesManager = new ServicesManager()

module.exports = servicesManager
