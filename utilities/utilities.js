const axios = require('axios')
const schedule = require('node-schedule')

const GoogleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY

const push = async pushToken => {
    console.log("INSIDE PUSH FUNCTIONS!")
    const message = {
        to: pushToken,
        sound: 'default',
        title: 'You logged in!',
        body: 'Thanks for logging into the OnTime app.',
        data: { data: 'goes here' },
        _displayInForeground: true,
    };
    const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        }
    })
}

const parseGoogleMapsMinutesText = text => {
    let answer = ""
    for (let i = 0; i < text.length; i++)
        if (text[i] >= '0' && text[i] <= '9') answer += text[i]
    return answer
}

const timeFromGoogleMapsAPI = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=transit&key=${GoogleMapsApiKey}`
    const { data } = await axios.get(url)
    const minutesString = parseGoogleMapsMinutesText(data.routes[0].legs[0].duration.text)
    const minutesInt = parseInt(minutesString)
    return minutesInt
}

const eventOccursToday = (startDate, endDate, weeklySchedule) => {
    const now = new Date()
        now = now.getTime()
    const startUTC = Date.parse(startDate.substring(0, 10))
    const endUTC = Date.parse(endDate.substring(0, 10))
    if (weeklySchedule[now.getDay()] !== '1') return false
    if (now < startUTC && endUTC < now) return false
    return true
}

const notificationTime = (time, currentDuration) => {

}

const sendPushNotifications = async (eventsPrivate, eventsPublic, pushToken) => {
    eventsPrivate.forEach(async event => {
        // determine typical travel time, API call
        const {
            startDate, 
            endDate, 
            weeklySchedule, 
            time,  
            startLat, 
            startLng, 
            lat, 
            lng
        } = event
        if (eventOccursToday(startDate, endDate, weeklySchedule)) {
            const currentDuration = await timeFromGoogleMapsAPI({startLat, startLng}, {lat, lng})
            
        }
    })
}

const combinePublicEventsToUsers = (events, users) => {
    return events.map(event => {
        let user = users.find(user => user.eventId === event.id)
        return {
            event,
            user
        }
    })
}

module.exports = {
    push,
    timeFromGoogleMapsAPI,
    combinePublicEventsToUsers
}