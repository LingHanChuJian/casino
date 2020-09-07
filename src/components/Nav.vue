<template lang="pug">
    SubMenu(
        v-if="menuItemData.children"
        :name="menuItemData.name"
        :class="[menuItemData.className ? prefixCls + '-' + menuItemData.className : '']"
    )
        template(v-slot:title)
            NavIcon(:icon="menuItemData.icon")
            | {{ menuItemData.content }}
        MenuItem(
            v-for="item in menuItemData.children"
            :key="item.name"
            :name="item.name"
            :to="item.to"
        )
            NavIcon(:icon="item.icon")
            | {{ item.content }}
    MenuItem(
        v-else
        :name="menuItemData.name"
        :to="menuItemData.to"
        :class="[menuItemData.className ? prefixCls + '-' + menuItemData.className : '']"
    )
        NavIcon(:icon="menuItemData.icon")
        | {{ menuItemData.content }}
</template>

<script lang="ts">
import { oneOf } from '@/utils'
import NavIcon from '@/components/NavIcon.vue'
import { Submenu, MenuItem } from 'view-design'
import { MenuItemData } from '@/types/commponents'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {
        Submenu,
        MenuItem,
        NavIcon,
    },
})
export default class Nav extends Vue {
    @Prop({
        type: Object,
        default() {
            return {}
        },
    })
    private menuItemData!: MenuItemData

    private prefixCls: string = 'nav'
}
</script>

<style lang="stylus" scoped>

</style>