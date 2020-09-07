<template lang="pug">
    Modal(v-model="isModel" :title="casinoConfigFrom.id ? '修改赌场配置' : '添加赌场配置'" footer-hide @on-cancel="onCancel")
        Form(:model="casinoConfigFrom" :label-width="90" ref="casinoConfigFrom" :rules="ruleCasinoConfigFrom")
            FormItem(label="赌场代码:" prop="code")
                Input(v-model="casinoConfigFrom.code" placeholder="请填入赌场代码")
            FormItem(label="赌场成本:" prop="cost")
                Input(v-model="casinoConfigFrom.cost" placeholder="请填入赌场成本")
            FormItem(label="赌场份额:" prop="share")
                Input(v-model="casinoConfigFrom.share" placeholder="请填入赌场份额")
            Button(type="primary" long @click="casinoConfigFromClick") {{ casinoConfigFrom.id ? '修改赌场配置' : '添加赌场配置' }}
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import EmitterMixins from '@/mixins/emitter'
import { CasinoConfigParams } from '@/types/utils'
import { Modal, Form, FormItem, Button, Input } from 'view-design'
import { ActionDetails, Rule, Validate } from '@/types/commponents'
import { Component, Prop, Watch, Mixins, Vue } from 'vue-property-decorator'


@Component({
    components: {
        Modal,
        Form,
        FormItem,
        Button,
        Input,
    },
})
export default class CasinoConfigModel extends Mixins(EmitterMixins) {
    @Prop({ type: Boolean, default: false })
    private value!: boolean

    @Prop({ type: String, default: '' })
    private title!: string

    private isModel: boolean = this.value

    private casinoConfigFrom: CasinoConfigParams = {
        id: '',
        code: '',
        cost: 0,
        share: 0,
    }

    private ruleCasinoConfigFrom: Rule = {
        code: [ { required: true, message: '赌场代码不能为空', trigger: 'blur' } ],
        cost: [
            {
                required: true,
                validator(rule, value, callback) {
                    if (!value) { return callback(new Error('赌场成本不能为空')) }
                    if (isNaN(Number(value))) { return callback(new Error('赌场成本只能是数字')) }
                    callback()
                },
                trigger: 'blur',
            },
        ],
        share: [
            {
                required: true,
                validator(rule, value, callback) {
                    if (!value) { return callback(new Error('赌场份额不能为空')) }
                    if (isNaN(Number(value))) { return callback(new Error('赌场份额只能是数字')) }
                    callback()
                },
                trigger: 'blur',
            },
        ],
    }

    public resetForm(): void {
        (this.$refs.casinoConfigFrom as Validate).resetFields()
    }

    private onCancel(): void {
        this.resetForm()
        this.$emit('on-cancel')
    }

    private casinoConfigFromClick(): void {
        (this.$refs.casinoConfigFrom as Validate).validate((isValid: boolean) => {
            if (!isValid) { return this.$Message.error('请按要求填写表单') }
            ipcRenderer.invoke('casino', Object.assign({ type: 'casino-config', action: this.casinoConfigFrom.id ? 'update' : 'add' }, this.casinoConfigFrom))
                .then((actionDetails: ActionDetails) => {
                    if (actionDetails.status !== 'success') { return this.$Message.error(actionDetails.message) }
                    this.$Message.success(actionDetails.message)
                    this.dispatch('CasinoConfig', 'on-casino-config-update-table-data', undefined)
                    this.resetForm()
                    this.isModel = false
                })
        })
    }

    @Watch('value')
    private onValueChange(newValue: boolean) {
        this.isModel = newValue
    }

    @Watch('isModel')
    private onIsModelChange(newValue: boolean) {
        this.$emit('input', newValue)
    }

    private mounted() {
        this.$on('on-casino-config-model-show', (casinoConfigParams: CasinoConfigParams) => {
            this.casinoConfigFrom = Object.assign({ id: '', code: '', cost: 0, share: 0 }, casinoConfigParams)
            this.isModel = true
        })
    }
}
</script>

<style lang="stylus" scoped>

</style>