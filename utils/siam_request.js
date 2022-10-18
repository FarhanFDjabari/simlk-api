var axios = require('axios');


const authToSiam = (nim, password) => {
    var data = { nim: nim, password: password };

    var config = {
        method: 'post',
        url: 'https://bemfilkom-rest.vercel.app/auth',
        headers: {
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(JSON.stringify(error));
        });
}


module.exports = {
    authToSiam
}
