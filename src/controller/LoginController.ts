import { Request, Response } from 'express'
import { controller, get, post } from '../decorator'
import { getResponseData } from '../utils//util'

interface IBodyRequest extends Request {
    body: {
        password: string | undefined;
        pageNum: number
    }
}

@controller('/api')
class LoginController {
    static isLogin(req: IBodyRequest): boolean {
        return !!(req.session ? req.session.login : false)
    }

    @get('/isLogin')
    isLogin(req: IBodyRequest, res: Response): void{
        res.json(getResponseData(LoginController.isLogin(req)))
    }
    @post('/login')
    login(req: IBodyRequest, res: Response): void {
        const { password } = req.body
        if (LoginController.isLogin(req)) {
            res.json(getResponseData(true))
        } else {
            if (password === 'zyzs' && req.session) {
                req.session.login = true
                res.json(getResponseData(true))
            } else {
                res.json(getResponseData(false, '登陆失败'))
            }
        }
    }

    @get('/logout')
    logout(req: IBodyRequest, res: Response): void {
        if (req.session) {
            req.session.login = undefined
        }
        res.json(getResponseData(true))
    }

    // @get('/')
    // home(req: IBodyRequest, res: Response): void {
    //     if (LoginController.isLogin(req)) {
    //         res.send(`
    //         <html>
    //             <body>
    //                 <form method="post" action="/api/getData">
    //                     页码(0、25、50、75...): <input type="number" name="pageNum" value="0"/>
    //                     <button>爬取</button>
    //                     <a href='/showData'>展示</a>
    //                     <a href='/logout'>退出</a>
    //                 </form>
    //             </body>
    //         </html>
    //         `)
    //     } else {
    //         res.send(`
    //         <html>
    //             <body>
    //                 <form method="post" action="/api/login">
    //                     密码: <input type="password" name="password" />
    //                     <button>登陆</button>
    //                 </form>
    //             </body>
    //         </html>
    //         `)
    //     }
    // }
}