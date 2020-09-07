<template lang="pug">
    Layout(:class="[prefixCls + '-wrap']")
        Sider(hide-trigger :width="240")
            NavDrawer(:menuData="menuData")
        Layout
            Header
                | 赌场营业时间 (工作日 9:30 - 3:00)
            Content
                router-view
            Footer
</template>

<script lang="ts">
import NavDrawer from '@/components/NavDrawer.vue'
import { MenuItemData } from '@/types/commponents'
import { Layout, Sider, Header, Content, Footer } from 'view-design'
import { Component, Vue } from 'vue-property-decorator'

@Component({
    components: {
        Layout,
        Sider,
        Header,
        Content,
        Footer,
        NavDrawer,
    },
})
export default class Index extends Vue {
    private menuData: MenuItemData[] = [
        {
            name: 'casino-config',
            content: '赌场配置',
            to: { path: '/' },
            icon: { type: 'md-settings' },
        },
        {
            name: 'casino-revenue',
            content: '赌场收益',
            to: { path: '/casino-revenue' },
            icon: { type: 'md-flame' },
        },
    ]

    private prefixCls: string = 'layout'
}
</script>

<style lang="stylus" scoped>
.layout-wrap
    min-height 100vh
</style>