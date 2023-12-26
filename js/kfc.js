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

  const date      = moment(data.timestamp)
  const initDate  = moment('2017-11-18 13:00')
  const during    = moment.duration(date.diff(initDate))
  const dYears    = during.years()
  const dMonths   = during.months()
  const dDays     = during.days()
  const updated   = date.format('YYYY.MM.DD hh:mm A')

  var interval  = ''
  if (dYears > 0)   interval += ` ${dYears} ปี `
  if (dMonths > 0)  interval += ` ${dMonths} เดือน `
  if (dDays  > 0)   interval += ` ${dDays} วัน `

  document.getElementById('interval').innerHTML = `ตลอด ${interval} ที่ผ่านมา`
  document.getElementById('counter').innerHTML  = `${counter} ครั้ง`
  document.getElementById('updated').innerHTML  = `ข้อมูลล่าสุด — ${updated}`
}