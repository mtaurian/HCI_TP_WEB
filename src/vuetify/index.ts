import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents
  },
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#D2A6FE',
          secondary: '#4A4458',
          /**
           * Changes the whole website background
           */
          background: '#331851',
          /**
           * Changes the background color of things such as select elements and its childs
           */
          surface: '#9E72C3',
          focus: '#6750A4',
          accent: '#EEEEEE',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
})

export default vuetify
