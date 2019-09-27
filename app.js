console.log('started nodejs...')

const fs = require('fs')
const core = require('@actions/core');
const exec = require('@actions/exec')
const path = require('path')
const helpers = require('./helpers')
const child_process = require('child_process');
const _ = require('underscore')

//require octokit rest.js
//more info at https://github.com/octokit/rest.js
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`
})

let baseDirectories = ''
if (process.env.BASE_DIRS) baseDirectories = `(?:${process.env.BASE_DIRS})\/`

//set eventOwner and eventRepo based on action's env variables
const eventOwnerAndRepo = process.env.GITHUB_REPOSITORY
const eventOwner = helpers.getOwner(eventOwnerAndRepo)
const eventRepo = helpers.getRepo(eventOwnerAndRepo)

const githubWorkspace = process.env.GITHUB_WORKSPACE

async function findChangedReposAndRunTests() {
  //read contents of action's event.json
  const eventData = await helpers.readFilePromise(
    '..' + process.env.GITHUB_EVENT_PATH
  )
  const eventJSON = JSON.parse(eventData)

  //set eventAction and eventIssueNumber
  eventAction = eventJSON.action
  eventIssueNumber = eventJSON.pull_request.number

  //get list of files in PR
  const prFiles = await helpers.listFiles(
    octokit,
    eventOwner,
    eventRepo,
    eventIssueNumber
  )

  //get monorepo repo for each file
  prFilesRepos = prFiles.map(({ filename }) =>
    helpers.getMonorepo(baseDirectories, filename)
  )

  //reduce to unique repos
  const prFilesReposUnique = _.uniq(prFilesRepos)

  //add label for each monorepo repo
  for (const repo of prFilesReposUnique) {
    if (repo) {
      core.startGroup('Run tests in ' + repo);

      try {
        const options = {
          cwd: path.join(githubWorkspace, repo)
        }
        if (fs.existsSync(path.join(options.cwd, "package.json"))) {
          if (fs.existsSync(path.join(options.cwd, "pre-test.sh"))) {
            await exec.exec("sh", ["pre-test.sh"], options);
          }
          await exec.exec("npm", ["install"], options)
          await exec.exec("npm", ["test"], options)
        } else {
          console.log("no node application - skipping tests");
        }
      } catch (e) {
        console.log("Failed to execute");
        core.setFailed(e.message);
      }

      core.endGroup()
    }
  }
}

//run the function
findChangedReposAndRunTests()
