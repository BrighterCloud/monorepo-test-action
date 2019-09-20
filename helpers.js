const fs = require('fs')

module.exports.readFilePromise = function(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  }).catch(err => {
    console.log(err)
  })
}

module.exports.getOwner = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(0, slicePos1)
}

module.exports.getRepo = function(eventOwnerAndRepo) {
  const slicePos1 = eventOwnerAndRepo.indexOf('/')
  return eventOwnerAndRepo.slice(slicePos1 + 1, eventOwnerAndRepo.length)
}

module.exports.listFiles = async function(
  octokit,
  eventOwner,
  eventRepo,
  eventIssueNumber
) {
  const options = octokit.pulls.listFiles.endpoint.merge({
    owner: eventOwner,
    repo: eventRepo,
    pull_number: eventIssueNumber
  })

  return await octokit
    .paginate(options)
    .then(data => {
      return data
    })

    .catch(err => {
      console.log(err)
    })
}

module.exports.getMonorepo = function(baseDirectories, filePath) {
  const regexPattern = `^${baseDirectories}([^./]*)/`
  var regex = new RegExp(regexPattern)
  var found = filePath.match(regex)

  if (found) return found[0]
  else return false
}