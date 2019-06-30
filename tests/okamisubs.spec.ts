jest.setTimeout(100000)

import OkamiSubs from '../src/scrapers/OkamiSubs'
const okamisubs = new OkamiSubs()

describe('Scraper OkamiSubs', () => {
  it('should respond with anime list', async () => {
    const animeList = await okamisubs.getAnimeList()

    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.map(el => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })
})
