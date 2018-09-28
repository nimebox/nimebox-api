jest.setTimeout(100000)

import Anime24 from '../src/scrapers/Anime24'
const anime24 = new Anime24()

describe('Scraper Anime24', () => {
  it('should respond with news', async () => {
    const news = await anime24.getNews()

    expect(Array.isArray(news)).toBeTruthy()
    expect(news).not.toBeNull()
    expect(news[1].title).toBeDefined()
    expect(news[1].url).toBeDefined()
    expect(news[1].date).toBeDefined()
    expect(news[1].description).toBeDefined()
    expect(news[1].image).toBeDefined()

  })
})
