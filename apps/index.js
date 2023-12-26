import { writeFile } from 'fs'
import { get } from 'https'

// prepare content
// TODO multi video track
function prepareContent(data, timestamp, asJson = true) {
  // choose the correct edge
  const id      = data.items[0].id
  const counter = Number(data.items[0].statistics.viewCount)

  // if not json, consider as csv line
  if (asJson !== true) {
    return '\n'.concat([id, timestamp, counter].join(','))
  }
  // otherwise, stringify object
  return JSON.stringify({
    id,
    timestamp,
    counter,
  })
}

// fetch content from api
const apiKey    = process.env.API_KEY
const videoId   = process.env.VIDEO_ID
const parts     = ['statistics']
const options   = {
  host: 'www.googleapis.com',
  path: `/youtube/v3/videos?part=${parts.join(',')}&id=${videoId}&key=${apiKey}`,
}

get(options, (res) => {
  const {statusCode} = res
  const contentType = res.headers['content-type']

  let error

  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message)
    res.resume()
    return
  }

  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => { rawData += chunk; })
  res.on('end', () => {
    try {
      // prepare timestamp
      const timestamp = Date.now()

      // prepare content
      const data        = JSON.parse(rawData)
      const jsonContent = prepareContent(data, timestamp)
      const csvContent  = prepareContent(data, timestamp, false)

      // prepare filename
      const dir         = '../data/'
      const currentFile = dir.concat('kfc.json')
      const historyFile = dir.concat('kfc-history.csv')

      // put content to files
      writeFile(currentFile, jsonContent, 'utf8', err => {
        if (err) {
          console.error('Error: ', err)
        } else {
          console.log(`File ${currentFile} saved.`)
        }
      })
      // write single line to history.csv
      writeFile(historyFile, csvContent, {flag:'a',encoding:'utf8'}, err => {
        if (err) {
          console.error('Error: ', err)
        } else {
          console.log(`File ${historyFile} saved.`)
        }
      })
    } catch (e) {
      console.error(e.message)
    }
  })
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`)
})
