import { format } from 'date-fns-tz'

function DateFormat(creationDate) {
    const dateObject = new Date(creationDate)
    return format(dateObject, 'MMMM do, yyyy, h:mm a')
}

export default DateFormat;