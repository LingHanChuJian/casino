import { RawLocation } from 'vue-router'
import { TableColumn } from 'view-design'
import { Vue } from 'vue-property-decorator'

export interface MenuIcon {
    type?: string
    size?: number | string
    color?: string
    custom?: string
}

export interface MenuItemData {
    name: string
    to?: RawLocation
    icon?: MenuIcon
    content: string
    className?: string
    children?: MenuItemData[]
}

export interface SummaryMethodOptions {
    columns: TableColumn[]
    data: any[]
}

export interface SummaryMethodValue {
    key: string
    value: string
}

export interface BaseSummaryMethod {
    [key: string]: SummaryMethodValue
}

export type RuleType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer'
| 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email'

export type Callback = (...args: any[]) => void

export interface RuleValidate {
    required?: boolean
    message?: string
    trigger: string
    type?: RuleType
    pattern?: RegExp
    validator?: (rule: RuleValidate, value: any, callback: Callback) => void
}

export type Validate = Vue & {
    validate: (callback: (valid: boolean) => void) => void
    validateField: (prop: string, callback?: (validate: string) => void) => void
    resetFields: () => void,
}

export interface Rule {
    [key: string]: RuleValidate[]
}

export interface ActionDetails {
    status?: string
    data?: any
    message?: string
}
