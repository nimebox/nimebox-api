import { AxiosRequestConfig, AxiosResponse } from 'axios'
export declare type Grabbi = (url: string, config?: AxiosRequestConfig) => Promise<{ doc: HTMLDocument, res: AxiosResponse }>
