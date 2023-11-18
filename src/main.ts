import './styles/main.scss'

import { createApp } from 'vue'

// Quasar related imports
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
  config: {
    brand: {
      primary: '#0D272Fff',
      'primary-light': '#E1F4F7ff',
      secondary: '#0A506Cff',
      accent: '#1DCAD3ff',
      'primary-dark': '#122A32ff',
      light: '#E1F4F7ff'
    }
  }
})

app.mount('#app')
