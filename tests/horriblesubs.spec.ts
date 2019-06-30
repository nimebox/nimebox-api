jest.setTimeout(100000)

import HorribleSubsScraper from '../src/scrapers/HorribleSubs'
const horrible = new HorribleSubsScraper()
const animeTitle = 'Sewayaki Kitsune no Senko-san'

describe('Scraper HorribleSubs', () => {
  it('should respond with anime list', async () => {
    const animeList = await horrible.getAnimeList()
    
    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.forEach((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })

  it('should respond with one anime', async () => {
    const anime = await horrible.getAnime(animeTitle)
    
    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.forEach((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })
})
