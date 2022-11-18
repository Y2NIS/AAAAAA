const oneRandomKey = function () {
    return Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2)
    .replace(/[01IO]/g, '')
  }
  
  const randomKeyOfSpecificLength = function (len) {
    let str = oneRandomKey()
    while (str.length < len) {
      str += oneRandomKey()
    }
    return str.slice(0, len)
  }
  
  exports.generate = function (length = 27, separator = '-', blockLength = 4) {
    const license = randomKeyOfSpecificLength(length)
    const regexp = new RegExp(`(\\w{${blockLength}})`, 'g')
    return license.replace(regexp, `$1${separator}`).substr(0, (length + Math.round(length / blockLength)) - 1)
  }