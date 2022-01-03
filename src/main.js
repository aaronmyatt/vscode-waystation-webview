// FILE: main.js

import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'


import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  extras: ['material-icons'],
  plugins: {
    Notify
  }, // import Quasar plugins and add here
  config: {
    notify: {}, // default set of options for Notify Quasar plugin
  }
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
