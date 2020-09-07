// 获取基金详情
export interface Fund {
    code: string
}

export interface ResponseBase {
    code: number
    message: string
}

export type ResponseError = ResponseBase

export interface ResponseSuccess extends ResponseBase {
    data: any
}
