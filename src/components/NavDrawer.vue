<template lang="pug">
    aside(:class="[prefixCls + '-wrap']")
        div(:class="[prefixCls + '-author']")
            img(src="./../assets/images/author.jpg")
        div(:class="[prefixCls + '-menu']")
            Menu(mode="vertical" theme="light" :active-name="activeName")
                Nav(v-for="item, index in menuData" :key="index" :menuItemData="item")
        div(:class="[prefixCls + '-footer']")
            p &copy; 2019 · 凌寒初见
</template>

<script lang="ts">
import { Menu } from 'view-design'
import Nav from '@/components/Nav.vue'
import { MenuItemData } from '@/types/commponents'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {
        Menu,
        Nav,
    },
})
export default class NavDrawer extends Vue {
    @Prop({
        type: Array,
        required: true,
        default() {
            return []
        },
    })
    private menuData!: MenuItemData[]

    private prefixCls: string = 'nav-drawer'

    private get activeName(): string {
        return this.$route.name || 'casino-config'
    }
}
</script>

<style lang="stylus" scoped>
.nav-drawer-wrap
    .nav-drawer-author
        margin 10px auto
        width 100px
        height 100px
        border-radius 50px
        img
            width 100px
            height 100px
            border-radius 50px
    .nav-drawer-menu
        margin 10px 0
    .nav-drawer-footer
        text-align center
</style>