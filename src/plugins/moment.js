import moment from 'moment'

export default {
  install: (Vue) => {
    // Monday is the first day of the week
    moment.updateLocale('en', {
      week: { dow: 1 }
    })

    Vue.prototype.$moment = moment
    Vue.moment = moment
  }
}
