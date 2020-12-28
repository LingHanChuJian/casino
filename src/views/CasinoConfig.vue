<template lang="pug">
    div(:class="[prefixCls + '-wrap']")
        div(:class="[prefixCls + '-operate']")
            Button(type="primary" icon="md-add" @click="addCasinoConfigClick") 添加赌场配置
            CasinoConfigModel
        div(:class="[prefixCls + '-table']")
            CasinoTable(
                :total="total"
                :current.sync="page"
                :pageSize="pageSize"
                :columns="tableColumns"
                :data="tableData"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            )
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import EmitterMixins from '@/mixins/emitter'
import { Button, TableColumn } from 'view-design'
import { CasinoConfigParams } from '@/types/utils'
import { ActionDetails } from '@/types/commponents'
import CasinoTable from '@/components/CasinoTable.vue'
import { Component, Mixins, Vue } from 'vue-property-decorator'
import CasinoConfigModel from '@/components/CasinoConfigModel.vue'


@Component({
    name: 'CasinoConfig',
    components: {
        Button,
        CasinoTable,
        CasinoConfigModel,
    },
})
export default class CasinoConfig extends Mixins(EmitterMixins) {
    private prefixCls: string = 'casino-config'

    private tableData: CasinoConfigParams[] = []

    private data: CasinoConfigParams[] = []

    private pageSize: number = 20

    private page: number = 1

    private total: number = 0

    private tableColumns: TableColumn[] = [
        {
            type: 'index',
            width: 60,
            align: 'center',
        },
        {
            key: 'code',
            title: '赌场名称(代码)',
            align: 'center',
            render: (h, params) => {
                const casinoConfigData: CasinoConfigParams = (params!.row as CasinoConfigParams)
                return h!('span', casinoConfigData.title + `(${casinoConfigData.code})`)
            },
        },
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
            key: 'action',
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
                return h!('div', [
                    h!(Button, {
                        props: {
                            type: 'primary',
                            size: 'small',
                        },
                        style: {
                            marginRight: '5px',
                        },
                        on: {
                            click: () => {
                                this.broadcast('CasinoConfigModel', 'on-casino-config-model-show', params!.row)
                            },
                        },
                    }, '修改配置'),
                    h!(Button, {
                        props: {
                            type: 'error',
                            size: 'small',
                        },
                        style: {
                            marginRight: '5px',
                        },
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    render: () => {
                                        return h!('p', '是否删除赌场配置?')
                                    },
                                    onOk: () => {
                                        const casinoConfigData: CasinoConfigParams = (params!.row as CasinoConfigParams)
                                        ipcRenderer.invoke('casino', Object.assign({ type: 'casino-config', action: 'remove' }, casinoConfigData))
                                            .then((result: ActionDetails) => {
                                                this.$Message.success(result.message)
                                                this.resetReadDBTableData()
                                            })
                                    },
                                    onCancel: () => { this.$Message.success('已取消删除') },
                                })

                            },
                        },
                    }, '删除配置'),
                ])
            },
        },
    ]

    private addCasinoConfigClick(): void {
        this.broadcast('CasinoConfigModel', 'on-casino-config-model-show', {})
    }

    private onPageChange(page: number): void {
        this.page = page
        this.resetTableData()
    }

    private onPageSizeChange(pageSize: number): void {
        this.page = 1
        this.pageSize = pageSize
        this.resetTableData()
    }

    private resetTableData(): void {
        const min: number = this.pageSize * (this.page - 1)
        const max: number = min + this.pageSize
        this.tableData = this.data.filter((item , index) => index >= min && index < max)
    }

    private resetReadDBTableData(): void {
        ipcRenderer.invoke('casino', { type: 'casino-config-update-table-data' })
            .then((result: CasinoConfigParams[]) => {
                this.data = result
                this.total = result.length
                this.resetTableData()
            })
    }

    private mounted() {
        this.resetReadDBTableData()
        this.$on('on-casino-config-update-table-data', () => this.resetReadDBTableData())
    }
}
</script>

<style lang="stylus" scoped>
.casino-config-wrap
    padding 10px
</style>
