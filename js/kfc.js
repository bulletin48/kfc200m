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
  const dataDate  = moment(data.timestamp)

  const toggler   = (e, def, alt, customfunc = null) => {
    const el = e.target || e
    const useDef = (el.dataset.useRel === "false") ? false : true
    el.innerHTML = useDef ? alt : def
    el.dataset.useRel = !useDef
    if (typeof customfunc === "function" && customfunc !== null)
      customfunc(useDef)
  }

  // interval
  const initDate  = moment('2017-11-18 18:00')
  const during    = moment.duration(dataDate.diff(initDate))
  const dYears    = during.years()
  const dMonths   = during.months()
  const dDays     = during.days()
  let interval = ''
  if (dYears > 0)   interval += ` ${dYears} ปี `
  if (dMonths > 0)  interval += ` ${dMonths} เดือน `
  if (dDays  > 0)   interval += ` ${dDays} วัน `

  const intervalString = `ตลอด ${interval} ที่ผ่านมา`
  const initDateString = `นับตั้งแต่ ${initDate.locale('th').format('D MMM YYYY[,] HH:mm [น.]')}`
  const intervalElement = document.querySelector('#interval')
  intervalElement.innerHTML = intervalString
  intervalElement.dataset.useDef = true
  intervalElement.onclick = (e) => toggler(e, intervalString, initDateString)

  // counter
  const aim       = 200000000
  const counter   = data.counter
  const countdown = aim - counter

  const narratorElement = document.querySelector('#narrator')
  const counterElement  = document.querySelector('#counter')
  const kfcLink         = '<a href="https://youtu.be/mfqJyKm20Z4" target="KFC">คุกกี้เสี่ยงทาย</a>'
  const narratorString  = `ชาวไทย${kfcLink}ไปแล้ว`
  const counterString   = `${counter.toLocaleString('th-TH')} ครั้ง`

  let countdownNarratorString
  let countdownString
  if (countdown > 0) {
    countdownNarratorString = `เพื่อให้ถึง 200 ล้านครั้ง<br />ชาวไทยต้อง${kfcLink}`
    countdownString = `อีก ${countdown.toLocaleString('th-TH')} ครั้ง`
  } else {
    countdownNarratorString = `ชาวไทย${kfcLink}ครบ`
    countdownString = '200 ล้านครั้งแล้ว!'
  }

  narratorElement.innerHTML = narratorString
  counterElement.innerHTML  = counterString
  counterElement.dataset.useDef = true
  counterElement.onclick = (e) => toggler(e, counterString, countdownString, (useDef) => {
    narratorElement.innerHTML = useDef ? countdownNarratorString : narratorString
  })

  // updated
  const date        = moment()
  const updated     = dataDate.format('YYYY.MM.DD hh:mmA')
  const relUpdated  = moment.duration(dataDate.diff(date)).locale('th').humanize(true)

  const updateElement   = document.querySelector('#updated')
  const updateString    = `ข้อมูลล่าสุด — ${updated}`
  const relUpdateString = `ข้อมูลล่าสุด — ${relUpdated}`
  updateElement.innerHTML = relUpdateString
  updateElement.dataset.useDef  = true
  updateElement.onclick = (e) => toggler(e, relUpdateString, updateString)
}