import { RequestHandler } from 'express'

export function use(middleware: RequestHandler) {
    return function (target: any, key: string) {
        const orgMiddlewares = Reflect.getMetadata('middlewares', target, key) || []
        orgMiddlewares.push(middleware)
        Reflect.defineMetadata('middlewares', orgMiddlewares, target, key)
    }
}