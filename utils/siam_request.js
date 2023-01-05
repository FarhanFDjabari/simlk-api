var axios = require('axios');


const authToSiam =  async (nim, password) => {
    var data = { nim: nim, password: password };

    var config = {
        method: 'post',
        url: 'https://bemfilkom-rest.vercel.app/auth',
        headers: {
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            console.log(response)
            return response.data.data
        })
        .catch(function (error) {
            console.log(error)
            return null
        });
}

module.exports = {
    authToSiam
}
