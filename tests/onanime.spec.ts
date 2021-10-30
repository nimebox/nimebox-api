jest.setTimeout(100000)

import onanime from '../src/scrapers/onanime'
const animeTitle = 'Death Note'
// FIXME
describe.skip('Scraper onanime', () => {
  it('should respond with anime list', async () => {
    const animeList = await onanime.getAnimeList()

    expect(Array.isArray(animeList)).toBeTruthy()
    expect(animeList).not.toBeNull()
    animeList.items.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
      expect(el.image).toBeDefined()
    })
  })
  it('should respond with one anime', async () => {
    const anime = await onanime.getAnime(animeTitle)

    expect(Array.isArray(anime)).toBeTruthy()
    expect(anime).not.toBeNull()
    anime.items.map((el) => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
    })
  })
})
