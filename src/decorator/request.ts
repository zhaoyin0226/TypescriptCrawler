import 'reflect-metadata'
import { Methods } from '../utils/emum'

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