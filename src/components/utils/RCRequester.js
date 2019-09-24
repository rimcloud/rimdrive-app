import axios, { post }  from "axios";
import qs from "qs";

export const SERVER_URL = '/gpms/';

export function grRequestPromise(url, param) {

  return new Promise((resolve, reject) => {
    axios({
      method: (param.method) ? param.method : "post",
      url: SERVER_URL + url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [
        function(data, headers) {
          return qs.stringify(data, {arrayFormat:'brackets'});
        }
      ],
      data: param,
      withCredentials: false
    }).then(function(response) {

      if (response.data) {
        if (response.data.status && response.data.status.result === "success" && response.data.data && response.data.data.length > 0) {
            resolve(response.data);
        } else {
          resolve(response.data);
        }
      } else {
          reject(response);
      }

    }).catch(function(error) {

    });
  });
};


export function requestPostAPI(url, param, headers) {

  return axios({
    method: "post",
    url: SERVER_URL + url,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    transformRequest: [
      function(data, headers) {
        return qs.stringify(data, {arrayFormat:'brackets'});
      }
    ],
    data: param,
    withCredentials: false
  });
};

// multipartform
export function requestMultipartFormAPI(url, param, headers) {
  return axios({
      method: "post",
      url: SERVER_URL + url,
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [
        function(data, headers) {

          // const formData = new FormData();
          // formData.append('wallpaperFile','file');
          // formData.append('wallpaperNm', 'FILENAME_777');

          let formData = new FormData();
          for( let key in data ) {
            formData.append(key, data[key]);
          }


          return formData;
        }
      ],
      data: param,
      withCredentials: false
    });
};

