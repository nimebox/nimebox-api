jest.setTimeout(100000)

import Animawka from '../src/scrapers/Animawka'
const animawka = new Animawka()

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
})
