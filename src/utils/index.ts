const getDomainName = url => {
  const regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
  return regex.exec(url)[1].toLowerCase()
}

const wait = (ms: number) => new Promise((resolve, reject) => setTimeout(resolve, ms))

export type AnimeRespone = {
  serviceId?: string
  lang?: string
  data?: any[]
}

export default {
  getDomainName,
  wait
}
