const formatDate = (date) => {
    var d = new Date(date)

    let mo = new Intl.DateTimeFormat('us', { month: 'long' }).format(d);

    var datestring = ("0" + d.getDate()).slice(-2) + " " + mo + " " + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    return datestring
}

module.exports = {
    formatDate
}
