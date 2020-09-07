import { TableColumn } from 'view-design'

export interface CasinoConfigParams {
    id?: string
    code?: string
    title?: string
    cost?: number   // 成本
    share?: number  // 份额
}

export interface CasinoRevenueParams {
    [key: string]: any
    code?: string
    title?: string
    income?: string             // 收益
    cost?: number               // 成本
    share?: number             // 份额
    holdingIncome?: number     // 持有收益
    holdingIncomeRate?: number // 持有收益率
    netWorth?: number         // 当前基金的单位净值
    expectGrowth?: string    // 当前基金日涨幅
    expectWorthDate?: string // 净值更新日期
}

export interface CasinoRevenueData {
    isDefiniteTime: boolean
}

export interface SummaryMethodCasinoRevenueParams {
    columns: TableColumn[]
    data: CasinoRevenueParams[]
}

export interface BaseData {
    [key: string]: any
}

export type DBData = BaseData
