const formatDate = (date) => {
    var d = new Date(date)
    let mo = d.toLocaleDateString('id', {month:'long'})
    var tanggal = d.toLocaleDateString('id', {day:'2-digit'})
    var datestring = tanggal + " " + mo + " " + d.getFullYear()

    return datestring
}

// console.log(formatDate("2022-11-10T15:00:00.000Z"))


module.exports = {
    formatDate
}
