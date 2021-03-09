import { Router, Request, Response, NextFunction } from 'express'
import Crawler from './utils/crawler'
import DoubanCarwler from './utils/doubanCarwler'
import { getResponseData } from './utils/util'
import fs from 'fs'
import path from 'path'

interface IBodyRequest extends Request {
    body: {
        password: string | undefined;
        pageNum: number
    }
}

//自定义中间件
const checkLogin = (req: IBodyRequest, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : false
    if (isLogin) {
        next()
    } else {
        res.json(getResponseData(null, '请先登陆'))
    }
}

const router = Router()

router.get('/', (req: IBodyRequest, res: Response) => {
    const isLogin = req.session ? req.session.login : false
    if (isLogin) {
        res.send(`
        <html>
            <body>
                <form method="post" action="/getData">
                    页码(0、25、50、75...): <input type="number" name="pageNum" value="0"/>
                    <button>爬取</button>
                    <a href='/showData'>展示</a>
                    <a href='/logout'>退出</a>
                </form>
            </body>
        </html>
        `)
    } else {
        res.send(`
        <html>
            <body>
                <form method="post" action="/login">
                    密码: <input type="password" name="password" />
                    <button>登陆</button>
                </form>
            </body>
        </html>
        `)
    }

})
router.post('/login', (req: IBodyRequest, res: Response) => {
    const { password } = req.body

    if (password === 'zyzs' && req.session) {
        req.session.login = true
        res.json(getResponseData(true))
    } else {
        res.json(getResponseData(false, '登陆失败'))
    }
})
router.get('/logout', (req: IBodyRequest, res: Response) => {
    if (req.session) {
        req.session.login = undefined
    }
    res.json(getResponseData(true))
})
router.post('/getData', checkLogin, (req: IBodyRequest, res: Response) => {

    const doubanCarwler = DoubanCarwler.getInstance(req.body.pageNum)
    new Crawler(doubanCarwler)
    res.json(getResponseData(true))
})
router.get('/showData', checkLogin, (req: IBodyRequest, res: Response) => {

    try {
        const position = path.resolve(__dirname, '../data/results.json')
        const results = fs.readFileSync(position, 'utf-8')
        res.json(getResponseData(JSON.parse(results)))
    } catch (e) {
        res.json(getResponseData(false, '尚未爬取数据'))
    }
})

export default router