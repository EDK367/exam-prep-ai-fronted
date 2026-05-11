import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },

  theme: {
    defaultTheme: 'light',

    themes: {
      light: {
        dark: false,

        colors: {
          // Base
          primary: '#00658d',
          secondary: '#5e5e5e',
          tertiary: '#5d5f5f',

          // Backgrounds
          background: '#f5faff',
          surface: '#ffffff',
          'surface-bright': '#f5faff',
          'surface-dim': '#d6dae0',

          // Containers
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#eff4fa',
          'surface-container': '#eaeef4',
          'surface-container-high': '#e4e9ee',
          'surface-container-highest': '#dee3e8',

          // Text
          'on-background': '#171c20',
          'on-surface': '#171c20',
          'on-surface-variant': '#3e4850',

          // Borders
          outline: '#6e7881',
          'outline-variant': '#bdc8d1',

          // Primary variants
          'primary-container': '#00aeef',
          'on-primary': '#ffffff',
          'on-primary-container': '#003e58',
          'primary-fixed': '#c6e7ff',
          'primary-fixed-dim': '#82cfff',
          'inverse-primary': '#82cfff',

          // Secondary variants
          'secondary-container': '#e2e2e2',
          'on-secondary': '#ffffff',
          'on-secondary-container': '#646464',

          // Tertiary variants
          'tertiary-container': '#a2a3a3',
          'on-tertiary': '#ffffff',
          'on-tertiary-container': '#37393a',

          // States
          error: '#ba1a1a',
          warning: '#ffb300',
          success: '#2e7d32',
          info: '#0288d1',

          // Error variants
          'error-container': '#ffdad6',
          'on-error': '#ffffff',
          'on-error-container': '#93000a',

          // Misc
          'surface-variant': '#dee3e8',
          'surface-tint': '#00658d',
          'inverse-surface': '#2c3135',
          'inverse-on-surface': '#ecf1f7',
        },
      },

      dark: {
        dark: true,

        colors: {
          // Base
          primary: '#82cfff',
          secondary: '#c6c6c6',
          tertiary: '#c6c6c7',

          // Backgrounds
          background: '#000000',
          surface: '#0f1720',

          // Containers
          'surface-container-lowest': '#0b0f14',
          'surface-container-low': '#11161d',
          'surface-container': '#161c24',
          'surface-container-high': '#1b222c',
          'surface-container-highest': '#212a35',

          // Text
          'on-background': '#ecf1f7',
          'on-surface': '#ecf1f7',
          'on-surface-variant': '#bdc8d1',

          // Borders
          outline: '#6e7881',
          'outline-variant': '#3e4850',

          // Primary variants
          'primary-container': '#004c6b',
          'on-primary': '#001e2d',
          'on-primary-container': '#c6e7ff',

          // Secondary variants
          'secondary-container': '#474747',
          'on-secondary': '#1b1b1b',
          'on-secondary-container': '#e2e2e2',

          // Tertiary variants
          'tertiary-container': '#454747',
          'on-tertiary': '#1a1c1c',
          'on-tertiary-container': '#e2e2e2',

          // States
          error: '#ffb4ab',
          warning: '#ffca28',
          success: '#81c784',
          info: '#4fc3f7',

          // Error variants
          'error-container': '#93000a',
          'on-error': '#690005',
          'on-error-container': '#ffdad6',

          // Misc
          'surface-variant': '#3e4850',
          'surface-tint': '#82cfff',
          'inverse-surface': '#ecf1f7',
          'inverse-on-surface': '#171c20',
        },
      },
    },
  },

  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },

    VCard: {
      rounded: 'xl',
      elevation: 0,
    },

    VTextField: {
      variant: 'outlined',
      rounded: 'lg',
      density: 'comfortable',
    },

    VSelect: {
      variant: 'outlined',
      rounded: 'lg',
      density: 'comfortable',
    },
  },
})