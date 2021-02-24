import Vuecookies from 'vue-cookies'
import Vue from 'vue'
Vue.use(Vuecookies)
Vue.prototype.$cookies = Vuecookies
var a = {
  getCookies(params) {
    return Vuecookies.get(params)
  },
  setCookies(key,value){
    return Vuecookies.set(key,value)
  }
}
export default a;