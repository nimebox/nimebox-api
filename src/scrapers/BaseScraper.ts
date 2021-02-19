/* eslint-disable max-len */
import { AxiosRequestConfig } from 'axios'
import client from './client'

export interface BaseScraperResponse {
  title: string
  url: string
  date?: string
  description?: string
  image?: string
}

export interface BasePlayerResponse {
  host: string
  player: string
}

export default abstract class BaseScraper {
  private _serviceId: string
  private _baseUrl: string
  private _lang: string
  protected config: AxiosRequestConfig

  constructor() {
    this.config = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3165.0 Safari/537.36',
      },
    }
  }

  public get baseUrl(): string {
    return this._baseUrl
  }

  public set baseUrl(value: string) {
    this._baseUrl = value
  }

  public get serviceId(): string {
    return this._serviceId
  }

  public set serviceId(value: string) {
    this._serviceId = value
  }

  public get lang(): string {
    return this._lang
  }

  public set lang(value: string) {
    this._lang = value
  }

  protected async api(endpoint: string, config?: AxiosRequestConfig, pure?: boolean) {
    if (pure) return await client(endpoint, Object.assign(this.config, config))
    return await client(`${this.baseUrl}/${endpoint}`, Object.assign(this.config, config))
  }
}
