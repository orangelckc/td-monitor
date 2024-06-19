import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const pinia = createPinia().use(piniaPluginPersistedstate)

createApp(App).use(pinia).mount('#app')
