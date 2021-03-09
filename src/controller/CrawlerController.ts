import 'reflect-metadata'
import fs from 'fs'
import path from 'path'
import Crawler from '../utils/crawler'
import DoubanCarwler from '../utils/doubanCarwler'
import { Request, Response, NextFunction } from 'express'
import { controller, use, get, post } from '../decorator'
import { getResponseData } from '../utils//util'

interface IBodyRequest extends Request {
    body: {
        password: string | undefined;
        pageNum: number
    }
}
//自定义中间件
const checkLogin = (req: IBodyRequest, res: Response, next: NextFunction): void => {
    const isLogin = !!(req.session ? req.session.login : false)
    if (isLogin) {
        next()
    } else {
        res.json(getResponseData(null, '请先登陆'))
    }
}
const test = (req: IBodyRequest, res: Response, next: NextFunction): void => {
    // res.send('aaaa1aa')
    console.log('testtestt  esttest')
    // res.send('1111111111111111aaaaaaaa')
    next()
}

@controller('/api')
class CrawlerController {

    @use(checkLogin)
    @post('/getData')
    getData(req: IBodyRequest, res: Response): void {
        const doubanCarwler = DoubanCarwler.getInstance(req.body.pageNum)
        new Crawler(doubanCarwler)
        res.json(getResponseData(true))
    }
   
    
    @use(test)
    @use(checkLogin)
    @get('/showData')
    showData(req: IBodyRequest, res: Response): void {
        try {
            const position = path.resolve(__dirname, '../../data/results.json')
            const results = fs.readFileSync(position, 'utf-8')
            res.json(getResponseData(JSON.parse(results)))
        } catch (e) {
            res.json(getResponseData(false, '尚未爬取数据'))
        }
    }
}