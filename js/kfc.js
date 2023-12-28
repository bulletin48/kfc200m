async function fetchJSON(req) {
  try {
      const res           = await fetch(req)
      const contentType   = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Sorry, data isn't in JSON format.")
      }
      const data = await res.json()
      return data
  } catch (error) {
      console.error('Error: ', error)
  }
}

function processData(data) {
  const counter = data.counter.toLocaleString('th-TH')
  const dataDate  = moment(data.timestamp)

  // interval
  let interval  = ''
  const initDate  = moment('2017-11-18 18:00')
  const during    = moment.duration(dataDate.diff(initDate))
  const dYears    = during.years()
  const dMonths   = during.months()
  const dDays     = during.days()
  if (dYears > 0)   interval += ` ${dYears} ปี `
  if (dMonths > 0)  interval += ` ${dMonths} เดือน `
  if (dDays  > 0)   interval += ` ${dDays} วัน `

  // updated
  const date        = moment()
  const updated     = dataDate.format('YYYY.MM.DD hh:mm A')
  const relUpdated  = moment.duration(dataDate.diff(date)).locale('th').humanize(true)

  document.getElementById('interval').innerHTML = `ตลอด ${interval} ที่ผ่านมา`
  document.getElementById('counter').innerHTML  = `${counter} ครั้ง`
  document.getElementById('updated').innerHTML  = `ข้อมูลล่าสุด — ${relUpdated}`
  document.getElementById('updated').setAttribute('title', updated)
}