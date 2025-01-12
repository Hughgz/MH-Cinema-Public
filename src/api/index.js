﻿import axios from 'axios';

export default function callApi(endpoint, method = 'GET', body) {
    return axios({
        method,
        url: `http://localhost:8080/api/${endpoint}`,
        data: body
    }).catch(err => {
        console.error(err);
        throw err; 
    });
}
