const x = require('x-ray')()

const getVideo = (url) => {
  return new Promise((resolve, reject) => {
    x(url, {
      script: ['script']
    })((err, obj) => {
      if (err) {
        reject(err)
      }
      const regexDataDecoder = /return\ p\}(?:\('(.*)\'\,)([0-9]+),([0-9]+),(?:\'(.*)\'\.split)/
      const regexGetVideoAndPoster = /(?:var videoposter\=\\\'(.*)\\\'\;).*(?:src:"(.+)+")/igm

      const script = obj.script[7]

      const encodedData = regexDataDecoder.exec(script)
      const arg1 = encodedData[1]
      const arg2 = encodedData[2]
      const arg3 = encodedData[3]
      const arg4 = encodedData[4].split('|')

      const decodedData = decodeString(arg1, arg2, arg3, arg4)

      const urlsRegex = regexGetVideoAndPoster.exec(decodedData)

      const poster = urlsRegex[1]
      const url = urlsRegex[2]
      const out = {
        poster: poster,
        url: url
      }
      resolve(out)
    })
  })
}

const decodeString = (p, a, c, k) => {
  while (c--) {
    if (k[c]) {
      p = p.replace(new RegExp('\\b' + c.toString(a) + '\\b', 'g'), k[c])
    }
  }
  return p
}

module.exports = {
  getVideo
}
