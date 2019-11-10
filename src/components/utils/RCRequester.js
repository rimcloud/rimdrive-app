import axios from "axios";

export const SERVER_URL = '/';


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

