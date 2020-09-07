import http from '@/api/http'
import * as API from '@/types/api'

/**
 *  获取基金基础信息 /v1/fund  GET
 *  code={number}
 */
export const fund = (data: API.Fund): Promise<API.ResponseSuccess> => http.get(`/fund`, { params: data })
