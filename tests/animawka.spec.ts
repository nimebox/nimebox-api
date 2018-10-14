jest.setTimeout(100000)

import Animawka from '../src/scrapers/Animawka'
const animawka = new Animawka()
const animeTitle = 'Nanatsu no Taizai: Imashime no Fukkatsu'

describe('Scraper Animawka', () => {
  it('should respond with anime list', async () => {
    const animeList = await animawka.getAnimeList()

    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
      expect(el.image).toBeDefined()
    })

  })
  it('should respond with one anime', async () => {
    const anime = await animawka.getAnime(animeTitle)

    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })

  })
  it('should respond with players for one anime', async () => {
    const players = await animawka.getPlayers(animeTitle, 1)

    expect(Array.isArray(players)).toBeTruthy()
    expect(players).not.toBeNull()
    players.map((el) => {
      expect(el.host).toBeDefined()
      expect(el.player).toBeDefined()
    })

  })
})
