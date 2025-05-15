//getDate
export const getDate = (format) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    switch (format) {
        case 'Y-m-d H:i:s':
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        case 'Y-m-d':
            return `${year}-${month}-${day}`
        case 'H:i:s':
            return `${hours}:${minutes}:${seconds}`
        case 'Y':
            return `${year}`
        case 'm':
            return `${month}`
        default:
            return null
    }
}


export const formatDate_DMY = (date) => {
    const fecha = new Date(date)
    return ("0" + fecha.getDate()).slice(-2) + "-" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" + fecha.getFullYear()
}

export const formatDate_YMD = (date) => {
    const fecha = new Date(date)
    return (fecha.getFullYear()) + "-" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "-" + ("0" + fecha.getDate()).slice(-2);
}