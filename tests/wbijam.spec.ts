jest.setTimeout(100000)

import Wbijam from '../src/scrapers/Wbijam'
const wbijam = new Wbijam()

describe('Scraper Wbijam', () => {
  it('should respond with anime list', async () => {
    const animeList = await wbijam.getAnimeList()

    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })
  it('should respond with one anime', async () => {
    const anime = await wbijam.getAnime('rezero')

    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })
  it('should respond with players for one anime', async () => {
    const players = await wbijam.getPlayers(`https://rezero.wbijam.pl/pierwsza_seria-26.html`)

    expect(Array.isArray(players)).toBeTruthy()
    expect(players).not.toBeNull()
    players.map((el) => {
      expect(el.host).toBeDefined()
      expect(el.player).toBeDefined()
    })
  })
})
