import { readdirSync, readFileSync, writeFile } from 'fs'

function getHistory(dir, list) {
  const files = readdirSync(dir)
  for (const file of files) {
    if (/kfc\-[0-9]+/.test(file)) {
      const filepath = dir.concat(file)
      const data = readFileSync(filepath)
      const {timestamp, counter} = JSON.parse(data)
      const id = process.env.VIDEO_ID
      const line = [id, timestamp, counter].join(',')
      list.push(line)
    }
  }
  console.log(list)
}

function putHistory(path, header, contents) {
  const data = [header, ...contents].join('\n')
  writeFile(path, data, () => {
    console.log('History patched!')
  })
}

const dir = '../data/'
const historyFile = 'kfc-history.csv'
const historyPath = dir.concat(historyFile)
const historyHeader = 'id,timestamp,counter'
const historyContent = []

getHistory(dir, historyContent)
putHistory(historyPath, historyHeader, historyContent)
