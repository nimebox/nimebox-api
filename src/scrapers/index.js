const _ = require('lodash')
const senpai = require('./senpai')
const animawka = require('./animawka')
const onanime = require('./onanime')
// TODO: add caching
const getAnimes = async () => {
  try {
    const sen = await senpai.getAnimes()
    const anikw = await animawka.getAnimes()
    const onanim = await onanime.getAnimes()
    return _.union(sen, anikw, onanim)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAnimes
}
