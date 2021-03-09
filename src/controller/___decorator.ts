import { Router, RequestHandler } from 'express'

export const router = Router()
enum Methods {
    get = 'get',
    post = 'post'
}

export function controller(target: any) {
    for (let key in target.prototype) {
        const path = Reflect.getMetadata('path', target.prototype, key)
        const method: Methods = Reflect.getMetadata('method', target.prototype, key)
        const middleware = Reflect.getMetadata('middleware', target.prototype, key)
        const handler = target.prototype[key]
        if (path && method && handler) {
            if (middleware) {
                router[method](path, middleware, handler)
            } else {
                router[method](path, handler)
            }

        }
    }
}
export function use(middleware: RequestHandler) {
    return function (target: any, key: string) {
        Reflect.defineMetadata('middleware', middleware, target, key)
    }
}

function getRequestDecorator(type: Methods) {
    return function (path: string) {
        return function (target: any, key: string) {
            Reflect.defineMetadata('path', path, target, key)
            Reflect.defineMetadata('method', type, target, key)
        }
    }
}
export const get = getRequestDecorator(Methods.get)
export const post = getRequestDecorator(Methods.post)

// export function get(path: string) {
//     return function (target: any, key: string) {
//         Reflect.defineMetadata('path', path, target, key)
//         Reflect.defineMetadata('method', 'get', target, key)
//     }
// }

// export function post(path: string) {
//     return function (target: any, key: string) {
//         Reflect.defineMetadata('path', path, target, key)
//         Reflect.defineMetadata('method', 'post', target, key)
//     }
// }