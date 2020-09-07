import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

Vue.use(Vuex)

interface Details {
    [propName: string]: Details
}

interface Modules {
    [key: string]: StoreOptions<Details>
}

const modules: Modules = {}
const files: __WebpackModuleApi.RequireContext = require.context('.', false, /\.ts$/)

files.keys().forEach((key: string) => {
    if (key === './index.ts') { return }
    modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
})

export default new Vuex.Store({
    modules,
})
