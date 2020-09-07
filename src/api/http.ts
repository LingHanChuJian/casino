import { ResponseError, ResponseSuccess } from '@/types/api'
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

const responseError: ResponseError[] = [
    {
        code: 400,
        message: '请求错误 (400)',
    },
    {
        code: 401,
        message: '未授权，请重新登录 (401)',
    },
    {
        code: 403,
        message: '拒绝访问 (403)',
    },
    {
        code: 404,
        message: '请求出错 (404)',
    },
    {
        code: 408,
        message: '请求超时 (408)',
    },
    {
        code: 500,
        message: '服务器错误 (500)',
    },
    {
        code: 501,
        message: '服务未实现 (501)',
    },
    {
        code: 502,
        message: '网络错误 (502)',
    },
    {
        code: 503,
        message: '服务不可用 (503)',
    },
    {
        code: 504,
        message: '网络超时 (504)',
    },
    {
        code: 505,
        message: 'HTTP版本不受支持 (505)',
    },
]

const instance: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    // withCredentials: true,
    timeout: 10000,
})

instance.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    if (config.method === 'POST') {
        if (!config.headers) { config.headers = {} }
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    return config
})

instance.interceptors.response.use((response: AxiosResponse): Promise<AxiosResponse<ResponseSuccess>> => {
    return response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response)
}, (error: AxiosError) => {
    if (error && error.response) {
        const itemError: ResponseError | undefined = responseError.find((item) => item.code === (error.response as AxiosResponse).status)
        error.message = itemError ? itemError.message : `连接出错(${error.response.status})!`
    } else {
        error.message = '连接服务器失败，请检查网络连接或联系管理员'
    }
    return Promise.reject(error)
})


export default instance
