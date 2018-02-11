const getDomainName = (url) => {
  const regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm
  return regex.exec(url)[1].toLowerCase()
}

module.exports = {
  getDomainName
}
