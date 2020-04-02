import BaseScraper from './BaseScraper'

export default class OkamiSubsScraper extends BaseScraper {
  constructor() {
    super()
    this.baseUrl = 'https://okami-subs.pl'
    this.serviceId = 'okamisubs'
    this.lang = 'pl'
  }

  public async getAnimeList(): Promise<any> {
    try {
      const { doc } = await this.api('lista_anime')
      const data = JSON.parse([...doc.scripts][4].innerHTML.trim().replace('window.InitData =', '').slice(0, -1))

      return data.animes.map((el) => {
        return {
          title: el.title,
          url: `${this.baseUrl}${el.path}`,
        }
      })
    } catch (err) {
      throw err
    }
  }
}
