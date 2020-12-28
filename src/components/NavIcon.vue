<template lang="pug">
    Icon(
        v-if="icon"
        :type="icon.type"
        :size="icon.size"
        :color="icon.color"
        :custom="icon.custom"
    )
</template>

<script lang="ts">
import { Icon } from 'view-design'
import { MenuIcon } from '@/types/commponents'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    name: 'NavIcon',
    components: {
        Icon,
    },
})
export default class NavIcon extends Vue {
    @Prop({
        type: Object,
        default() {
            return {}
        },
    })
    private icon?: MenuIcon
}
</script>

<style lang="stylus" scoped>

</style>