jest.setTimeout(100000)

import Animezone from '../src/scrapers/Animezone'
const animezone = new Animezone()
const animeTitle = 'Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai'

describe('Scraper Animezone', () => {
  it('should respond with one anime', async () => {
    const anime = await animezone.getAnime(animeTitle)

    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })

  })
})
