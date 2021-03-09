import express from 'express'
import bodyPasser from 'body-parser'
// import router from './router';
import cookieSession from 'cookie-session'
import './controller/LoginController'
import './controller/CrawlerController'
import { router } from './decorator'
 
/*
"devlop": "ts-node ./src/crawler.ts",
"devlopaa": "ts-node ./src/demo.ts",
*/
const app = express()
// 5.3 -> 9:00  自定义中间件的类型融合
app.use(bodyPasser.urlencoded({ extended: false }))
app.use(
    cookieSession({
        name: 'session',
        keys: ['zhao yin'],
        maxAge: 24 * 60 * 60 * 1000
    })
)
app.use(router)

// app.get('/', (req: Request, res: Response) => {
//     res.send('hello world')
// })
// app.get('/getdata', (req: Request, res: Response) => {
//     res.send('bye world')
// }) 

app.listen(7001, () => {
    console.log('server is running')
})