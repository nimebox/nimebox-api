jest.setTimeout(100000)

import Anime24 from '../src/scrapers/Anime24'
const anime24 = new Anime24()

describe('Scraper Anime24', () => {
  it('should respond with news', async () => {
    const news = await anime24.getNews()

    expect(Array.isArray(news)).toBeTruthy()
    expect(news).not.toBeNull()
    news.map(el => {
      expect(el.title).toBeDefined()
      expect(el.url).toBeDefined()
      expect(el.date).toBeDefined()
      expect(el.description).toBeDefined()
      expect(el.image).toBeDefined()
    })
  })
})
