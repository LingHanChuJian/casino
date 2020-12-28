<template lang="pug">
    div(:class="[prefixCls + '-wrap']")
        div(:class="[prefixCls + '-operate']")
            Button(type="primary" :icon="isDefiniteTime ? 'md-pause' : 'md-play'" @click="queryDefiniteTimeClick") 定时 ({{ time }}s) 查询
        div(:class="[prefixCls + '-table']")
            CasinoTable(
                :showPage="false"
                :columns="tableColumns"
                :data="tableData"
                show-summary
                :summary-method="handleSummary"
            )
</template>

<script lang="ts">
import { CreateElement } from 'vue'
import { ipcRenderer } from 'electron'
import { ActionDetails } from '@/types/commponents'
import CasinoTable from '@/components/CasinoTable.vue'
import { Component, Vue } from 'vue-property-decorator'
import { Button, TableColumn, TableColumnRenderParams } from 'view-design'
import { BaseData, CasinoRevenueParams, SummaryMethodCasinoRevenueParams } from '@/types/utils'


@Component({
    name: 'CasinoRevenue',
    components: {
        Button,
        CasinoTable,
    },
})
export default class CasinoRevenue extends Vue {
    private prefixCls: string = 'casino-revenue'

    private time: number = 60

    private timer?: NodeJS.Timeout

    private tableColumns: TableColumn[] = [
        {
            key: 'index',
            type: 'index',
            width: 70,
            align: 'center',
        },
        {
            key: 'code',
            title: '赌场名称(代码)',
            align: 'center',
            render: (h, params) => {
                const CasinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                return h!('span', CasinoRevenueData.title + `(${CasinoRevenueData.code})`)
            },
        },
        {
            title: '赌场本金',
            align: 'center',
            children: [
                {
                    key: 'cost',
                    title: '赌场成本',
                    align: 'center',
                },
                {
                    key: 'share',
                    title: '赌场份额',
                    align: 'center',
                },
                {
                    key: 'amount',
                    title: '合计金额(元)',
                    align: 'center',
                    render: (h: CreateElement, params: TableColumnRenderParams) => {
                        const casinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                        const amount: number = casinoRevenueData.cost! * casinoRevenueData.share!
                        return h('span', `${Math.round(amount)}`)
                    },
                },
            ],
        },
        {
            title: '赌场收益',
            align: 'center',
            children: [
                {
                    key: 'holdingIncomeRate',
                    title: '持有收益率(%)',
                    align: 'center',
                    render: (h: CreateElement, params: TableColumnRenderParams) => {
                        const casinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                        const amount: number = casinoRevenueData.cost! * casinoRevenueData.share!
                        const holdingIncome: number = (casinoRevenueData.netWorth! - casinoRevenueData.cost!) * casinoRevenueData.share!
                        return h('span', { style: { color: holdingIncome < 0 ? '#008000' : '#FF0000' } }, `${Math.round(holdingIncome / amount * 1000) / 10}`)
                    },
                },
                {
                    key: 'holdingIncome',
                    title: '持有收益额',
                    align: 'center',
                    render: (h: CreateElement, params: TableColumnRenderParams) => {
                        const casinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                        const holdingIncome: number = (casinoRevenueData.netWorth! - casinoRevenueData.cost!) * casinoRevenueData.share!
                        return h('span', { style: { color: holdingIncome < 0 ? '#008000' : '#FF0000' } }, `${Math.round(holdingIncome * 100) / 100}`)
                    },
                },
                {
                    key: 'expectGrowth',
                    title: '今日涨幅(%)',
                    align: 'center',
                    render: (h: CreateElement, params: TableColumnRenderParams) => {
                        const casinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                        return h('span', { style: { color: casinoRevenueData.expectGrowth && Number(casinoRevenueData.expectGrowth) < 0 ? '#008000' : '#FF0000' } }, casinoRevenueData.expectGrowth || '暂无')
                    },
                },
                {
                    key: 'income',
                    title: '今日收益(元)',
                    align: 'center',
                    render: (h: CreateElement, params: TableColumnRenderParams) => {
                        const casinoRevenueData: CasinoRevenueParams = (params!.row as CasinoRevenueParams)
                        const amount: number = casinoRevenueData.cost! * casinoRevenueData.share!
                        const estimateAmount: number = Math.round(amount * 100) / 100
                        const income: number = estimateAmount * Number(casinoRevenueData.expectGrowth!) / 100
                        return h('span', { style: { color: casinoRevenueData.expectGrowth && income < 0 ? '#008000' : '#FF0000' } }, casinoRevenueData.expectGrowth ? `${Math.round(income * 100) / 100}` : '暂无')
                    },
                },
                {
                    key: 'expectWorthDate',
                    title: '更新时间',
                    align: 'center',
                },
            ],
        },
    ]

    private handleSummary(summaryMethodParams: SummaryMethodCasinoRevenueParams): BaseData {
        const sums: BaseData = {}
        const { columns, data } = summaryMethodParams
        for (let i = 0, len = columns.length; i < len; i++) {
            const key: string = columns[i].key!
            switch (key) {
                case 'amount':
                    sums[key] = { key, value: data.reduce((total, item) => Math.round(total + item.cost! * item.share!), 0) }
                    break
                case 'holdingIncome':
                    sums[key] = {
                        key,
                        value: data.reduce((total, item) => {
                            const holdingIncomeItem = (item.netWorth! - item.cost!) * item.share!
                            return Math.round((total + holdingIncomeItem) * 100) / 100
                        }, 0),
                    }
                    break
                case 'income':
                    sums[key] = {
                        key,
                        value: data.reduce((total, item) => {
                            const amount: number = item.cost! * item.share!
                            const estimateAmount: number = Math.round(amount * 100) / 100
                            const income: number = estimateAmount * Number(item.expectGrowth!) / 100
                            return Math.round((total + (item.expectGrowth ? income : 0)) * 100) / 100
                        }, 0),
                    }
                    break
                default:
                    sums[key] = { key, value: i === 0 ? '合计' : 'N/A' }
                    break
            }
        }
        return sums
    }

    private resetTableData(): void  {
        ipcRenderer.invoke('casino', { type: 'casino-revenue' }).then((actionDetails: ActionDetails) => {
            if (actionDetails.status !== 'success') { return this.$Message.error(actionDetails.message) }
            this.$Message.success(actionDetails.message)
            this.tableData = actionDetails.data
        })
    }

    private queryDefiniteTimeClick(): void {
        if (this.isDefiniteTime) {
            if (this.timer) { clearInterval(this.timer) }
            this.isDefiniteTime = false
            return this.$Message.success('暂停查询')
        }
        this.isDefiniteTime = true
        this.$Message.success('开始查询')
        this.resetTableData()
        this.timer = setInterval(() => this.resetTableData(), this.time * 1000)
    }

    private set isDefiniteTime(value: boolean) {
        this.$store.dispatch('setIsDefiniteTime', value)
    }

    private get isDefiniteTime(): boolean {
        return this.$store.state.casinoRevenue.isDefiniteTime
    }

    private set tableData(value: CasinoRevenueParams[]) {
        this.$store.dispatch('setTableData', value)
    }

    private get tableData(): CasinoRevenueParams[] {
        return this.$store.state.casinoRevenue.tableData
    }
}
</script>

<style lang="stylus" scoped>
.casino-revenue-wrap
    padding 10px
</style>