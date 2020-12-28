import { Component, Vue } from 'vue-property-decorator'

function broadcast(this: Vue, componentName: string, eventName: string, params: any | any[]): void {
    this.$children.forEach((child) => {
        const name: string | undefined = child.$options.name
        if (name === componentName) {
            Array.isArray(params) ? child.$emit.apply(child, [eventName, ...params]) : child.$emit.apply(child, [eventName, params])
        } else {
            Array.isArray(params) ? broadcast.apply(child, [componentName, eventName, params]) : broadcast.apply(child, [componentName, eventName, [params]])
        }
    })
}

@Component({
    name: 'EmitterMixins',
})
export default class EmitterMixins extends Vue {
    /**
     *  向上查找指定Vue元素, 派发自定义事件
     * @param componentName 组件名称
     * @param eventName 事件名称
     * @param params 参数
     */
    public dispatch(componentName: string, eventName: string, params: any | any[]): void {
        let parent: Vue = this.$parent || this.$root
        let name: string | undefined = parent.$options.name

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent
            if (parent) {
                name = parent.$options.name
            }
        }

        if (parent) {
            Array.isArray(params) ? parent.$emit.apply(parent, [eventName, ...params]) : parent.$emit.apply(parent, [eventName, params])
        }
    }

    /**
     *  向下查找指定Vue元素, 派发自定义事件
     * @param componentName 组件名称
     * @param eventName 事件名称
     * @param params 参数
     */
    public broadcast(componentName: string, eventName: string, params: any | any[]): void {
        broadcast.call(this, componentName, eventName, params)
    }
}
