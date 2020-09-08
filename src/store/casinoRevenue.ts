import { StoreOptions } from 'vuex'
import { CasinoRevenueData, CasinoRevenueParams } from '@/types/utils'

const store: StoreOptions<CasinoRevenueData> = {
    state: {
        isDefiniteTime: false,
        tableData: [],
    },
    mutations: {
        SET_IS_DEFINITE_TIME(state, isDefiniteTime: boolean) {
            state.isDefiniteTime = isDefiniteTime
        },
        SET_TABLE_DATA(state, tableData: CasinoRevenueParams[]) {
            state.tableData = tableData
        },
    },
    actions: {
        setIsDefiniteTime({ commit }, isDefiniteTime: boolean) {
            commit('SET_IS_DEFINITE_TIME', isDefiniteTime)
        },
        setTableData({ commit }, tableData: CasinoRevenueParams[]) {
            commit('SET_TABLE_DATA', tableData)
        },
    },
}

export default store
