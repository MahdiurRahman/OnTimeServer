const axios = require('axios')
const schedule = require('node-schedule')

const GoogleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY

// Helpers
    const parseGoogleMapsMinutesText = text => {
        text = text.split(" ")
        let hours = 0, minutes = 0;
        if (text.length === 4) {
            hours = parseInt(text[0])
            minutes = parseInt(text[2])
        }
        else {
            minutes = parseInt(text[0])
        }
        return (minutes * 60) + (hours * 60 * 60)
    }

    const timeFromGoogleMapsAPI = async (origin, destination) => {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.startLat},${origin.startLng}&destination=${destination.lat},${destination.lng}&mode=transit&key=${GoogleMapsApiKey}`
        const { data } = await axios.get(url)
        const answer = parseGoogleMapsMinutesText(data.routes[0].legs[0].duration.text)
        return answer
    }

    const eventOccursToday = (startDate, endDate, weeklySchedule) => {
        let now = new Date()
        let nowTime = now.getTime()
        const startUTC = Date.parse(startDate.substr(0, 9))
        const endUTC = Date.parse(endDate.substr(0, 9))
        if (weeklySchedule[now.getDay()] !== '1') return false
        if (nowTime < startUTC && endUTC < nowTime) return false
        return true
    }

    const militaryTimeToSeconds = time => {
        const segments = time.split(":")
        const timeInSeconds = parseInt(segments[2]) + (parseInt(segments[1]) * 60) + (parseInt(segments[0]) * 60 * 60)
        return timeInSeconds
    }

    const calculatePushTime = (eventTime, moveBack) => {
        let pushTime = eventTime - moveBack;
        let timeArray = []
        timeArray.push(Math.floor(pushTime / 3600)) // hours
        pushTime %= 3600
        timeArray.push(Math.floor(pushTime / 60)) // minutes
        pushTime %= 60
        timeArray.push(pushTime) // seconds
        return timeArray
    }

// Scheduling
    const schedulePushNotifications = async (events, pushToken) => {
        console.log("schedulePushNotifications:", pushToken)
        for (let i = 0; i < events.length; i++) {
            let event = events[i]
            let {
                startDate,
                endDate, 
                weeklySchedule, 
                time,  
                startLat, 
                startLng, 
                lat,
                lng
            } = event
            startDate = JSON.stringify(startDate)
            endDate = JSON.stringify(endDate)
            if (eventOccursToday(startDate, endDate, weeklySchedule)) {
                const currentDuration = await timeFromGoogleMapsAPI({startLat, startLng}, {lat, lng})
                const timeArray = calculatePushTime(militaryTimeToSeconds(time), (currentDuration + 3600))
                schedulePush1(event, timeArray, pushToken)
            }
        }
    }

    const schedulePush1 = async (event, timeArray, pushToken) => {
        console.log("schedulePush1:", event, timeArray, pushToken)
        // calculate time for push 1
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const day = now.getDate()
        const [hour, minute, second] = timeArray
        // node-scheduler 1
        const pushDate = new Date(year, month, day, hour, minute, 0)
        schedule.scheduleJob(pushDate, () => schedulePush2(event, pushToken))
    }

    const schedulePush2 = async (event, pushToken) => {
        console.log("schedulePush2:", event, pushToken)
        const {
            startLat,
            startLng,
            lat,
            lng,
            time
        } = event
        // calculate time for push 2
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const day = now.getDate()
        const duration = await timeFromGoogleMapsAPI({startLat, startLng}, {lat, lng})
        const timeArray = calculatePushTime(militaryTimeToSeconds(time), (duration + 1800))
        const [hour, minute, second] = timeArray
        // node-scheduler 2
        const pushDate = new Date(year, month, day, hour, minute, 0)
        schedule.scheduleJob(pushDate, () => pushNotificaiton(event, pushToken))
    }

    const pushNotificaiton = async (event, pushToken) => {
        console.log("pushNotificaiton:", event, pushToken)
        const {
            eventName,
            time,
            locationName
        } = event
        // console.log(`pushNotificaiton -> The event "${eventName}" starts at "${time}" at "${locationName}"`)
        const message = {
            to: pushToken,
            sound: 'default',
            title: eventName,
            body: `The event "${eventName}" starts at "${time}" at "${locationName}"`,
            data: { data: event },
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

// Modify Events
    const combinePublicEventsToUsers = (events, users) => {
        return events.map(event => {
            let user = users.find(user => user.eventId === event.id)
            return {
                event,
                user
            }
        })
    }

    const preprocessPublicEvents = publicEvents => {
        return publicEvents.map(publicEvent => {
            const {
                eventName,
                startDate,
                endDate,
                weeklySchedule,
                time,
                locationName,
                lat,
                lng
            } = publicEvent.event
            const {
                startLat,
                startLng
            } = publicEvent.user
            return {
                eventName,
                startDate,
                endDate,
                weeklySchedule,
                time,
                locationName,
                lat,
                lng,
                startLat,
                startLng
            }
        })
    }

module.exports = {
    pushNotificaiton,
    timeFromGoogleMapsAPI,
    combinePublicEventsToUsers,
    preprocessPublicEvents,
    schedulePushNotifications
}