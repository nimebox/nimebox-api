import { AxiosRequestConfig } from 'axios'
import grabbi from 'grabbi'

export interface IBaseScraperResponse {
  title: string
  url: string
  date?: string
  description?: string
  image?: string
}

export default abstract class BaseScraper {
  private _serviceId: string
  private _baseUrl: string
  protected config: AxiosRequestConfig

  constructor() {
    this.config = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36',
      },
    }
  }

  protected get baseUrl(): string {
    return this._baseUrl
  }

  protected set baseUrl(value: string) {
    this._baseUrl = value
  }

  protected get serviceId(): string {
    return this._serviceId
  }

  protected set serviceId(value: string) {
    this._serviceId = value
  }

  protected async api(endpoint: string) {
    return await grabbi(`${this.baseUrl}/${endpoint}`, this.config)
  }

}
