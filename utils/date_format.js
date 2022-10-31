const formatDate = (date) => {
    var d = new Date(date)


    let mo = new Intl.DateTimeFormat('id', { month: 'long' }).format(d);
    var jam = new Date(date).toLocaleTimeString('id',{ hour: '2-digit', minute: '2-digit' });
    var tanggal = d.toLocaleDateString('id', {day:'2-digit'})

    var jamDummy = jam.split('.')

    jam = (jamDummy[0]-7) + ':' + jamDummy[1]

    var datestring = tanggal + " " + mo + " " + d.getFullYear() + " " + jam

    return datestring
}

// console.log(formatDate("2022-11-10T15:00:00.000Z"))


module.exports = {
    formatDate
}
