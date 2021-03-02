import axios from 'axios'
axios.defaults.withCredentials = true
export function request(config){
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials : true,
  })
  return instance(config)//return一个promise可以直接调用.then().catch()
}
// export function request(config){
//   return new Promise((resolve,reject) => {
//     const instance = axios.create({
//       baseURL: 'http://123.207.32.32:8000',
//       timeout: 5000
//     })
//     instance(config)
//     .then(res => {
//       resolve(res)
//     })
//     .catch(err => {
//       reject(err);
//     })
//   })
// }