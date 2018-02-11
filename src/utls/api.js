const axios = require('axios')
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support')
const tough = require('tough-cookie')
const cookieJar = new tough.CookieJar()
axiosCookieJarSupport(axios)

module.exports = axios.create({
  jar: cookieJar,
  withCredentials: true
})
