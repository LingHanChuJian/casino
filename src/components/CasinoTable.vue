<template lang="pug">
    div(:class="[prefixCls + '-wrap']")
        Table(
            :columns="columns"
            :data="data"
            :loading="loading"
            :sum-text="sumText"
            :show-summary="showSummary"
            :summary-method="summaryMethod"
            border
        )
        Page(
            v-if="showPage"
            :current.sync="current"
            :total="total"
            :page-size="pageSize"
            show-total
            show-elevator
            show-sizer
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
        )
</template>

<script lang="ts">
import { Table, TableColumn, Page } from 'view-design'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SummaryMethodOptions, BaseSummaryMethod } from '@/types/commponents'

@Component({
    components: {
        Table,
        Page,
    },
})
export default class CasinoTable extends Vue {
    @Prop({
        type: Array,
        default() {
            return []
        },
    })
    private columns!: TableColumn[]

    @Prop({
        type: Array,
        default() {
            return []
        },
    })
    private data!: object[]

    @Prop({ type: Boolean, default: false })
    private loading!: boolean

    @Prop({ type: Boolean, default: false })
    private showSummary!: boolean

    @Prop({ type: Function })
    private summaryMethod?: (options: SummaryMethodOptions) => BaseSummaryMethod

    @Prop({ type: String, default: '合计' })
    private sumText!: string

    @Prop({ type: Boolean, default: true })
    private showPage!: boolean

    @Prop({ type: Number, default: 1 })
    private current!: number

    @Prop({ type: Number, default: 0 })
    private total!: number

    @Prop({ type: Number, default: 20 })
    private pageSize!: number

    private prefixCls: string = 'casino-table'

    private onPageChange(page: number): void {
        this.$emit('on-page-change', page)
    }

    private onPageSizeChange(pageSize: number): void {
        this.$emit('on-page-size-change', pageSize)
    }

}
</script>

<style lang="stylus" scoped>
.casino-table-wrap
    padding-top 10px
    div
        margin-bottom 10px
</style>