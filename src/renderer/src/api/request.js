import axios from 'axios'

const baseURL = `http://tianci.run`

const request = axios.create({
  baseURL,
  timeout: 5000
});

//响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.status){
    return response.data.data;
  }else{
    ElMessage.error({
      message: response.data.message,
      offset: 40
    });
  }
}, function (error) {
  // 对响应错误做点什么
  ElMessage.error({
    message: error.message,
    offset: 40
  });
  return Promise.reject(error);
});


export default request