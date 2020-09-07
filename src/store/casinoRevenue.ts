import { StoreOptions } from 'vuex'
import { CasinoRevenueData } from '@/types/utils'

const store: StoreOptions<CasinoRevenueData> = {
    state: {
        isDefiniteTime: false,
    },
    mutations: {
        SET_IS_DEFINITE_TIME(state, isDefiniteTime: boolean) {
            state.isDefiniteTime = isDefiniteTime
        },
    },
    actions: {
        setIsDefiniteTime({ commit }, isDefiniteTime: boolean) {
            commit('SET_IS_DEFINITE_TIME', isDefiniteTime)
        },
    },
}

export default store
