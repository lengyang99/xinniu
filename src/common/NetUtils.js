import React, { Component } from 'react';
let common_url ='http://10.4.24.11:8081';//服务器地址
class NetUtils extends Component {
    fetchRequest(url, params = '') {
        let header = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        if (!params) {
            return new Promise(function (resolve, reject) {
                        fetch(common_url + url, {
                            method: 'POST',
                            headers: header
                        }).then((response) => {
                            resolve(response.json())
                        })
                    .catch((err) => {
                        reject(err);
                    });
            });
        } else {
            return new Promise(function (resolve, reject) {
                fetch(common_url + url, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(params)
                }).then((response) => {
                    resolve(response.json())
                }).catch((err) => {
                    reject(err);
                });
            });
        }
    }
}
export default new NetUtils()
