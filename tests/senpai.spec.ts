jest.setTimeout(100000)

import Senpai from '../src/scrapers/Senpai'
const senpai = new Senpai()
const animeTitle = 'Akatsuki no Yona'

describe('Scraper Senpai', () => {
  it('should respond with anime list', async () => {
    const animeList = await senpai.getAnimeList()

    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
      expect(el.image).toBeDefined()
    })

  })
  it('should respond with one anime', async () => {
    const anime = await senpai.getAnime(animeTitle)

    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })

  })
  it('should respond with players for one anime', async () => {
    const players = await senpai.getPlayers(animeTitle, 1)

    expect(Array.isArray(players)).toBeTruthy()
    expect(players).not.toBeNull()
    players.map((el) => {
      expect(el.host).toBeDefined()
      expect(el.player).toBeDefined()
    })

  })
})
