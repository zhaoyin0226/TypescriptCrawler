import superagent from 'superagent'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
// 3-5 优化代码
interface IMovieRecord {
    name: string;
    star: number;
}
interface IResults {
    time: number;
    data: IMovieRecord[];
}
interface IJsonContent {
    [propName: number]: IMovieRecord[]
}
class Crawler {
    private start = 0
    private url = `https://movie.douban.com/top250?start=${this.start}&filter=`
    private MovieRecords: IMovieRecord[] = []
    private filePath = path.resolve(__dirname, '../data/results.json')
    getJsonInfo(html: string) {
        const $ = cheerio.load(html)
        const hds = $('.hd')
        hds.map((k, v) => {
            // const titles = $(v).children('.title')
            const titles = $(v).find('.title')
            this.MovieRecords.push({ name: titles.eq(0).text(), star: 0 })
        })

        const starts = $('.rating_num')
        starts.map((k, v) => {
            this.MovieRecords[k].star = Number($(v).text())
        })

        return {
            time: new Date().getTime(),
            data: this.MovieRecords,
        }

    }
    async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }
    generateJsonContent(jsonInfos: IResults) {
        let fileContent: IJsonContent = {}
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
        }
        fileContent[jsonInfos.time] = jsonInfos.data
        return fileContent
    }
    wirteFile(content: string) {
        fs.writeFileSync(this.filePath, content)
    }
    async initSpiderProcess() {
        const html = await this.getRawHtml()
        const jsonInfos = this.getJsonInfo(html)
        const fileContent = this.generateJsonContent(jsonInfos)
        this.wirteFile(JSON.stringify(fileContent))
    }
    constructor() {
        this.initSpiderProcess()
    }
}
const crawler = new Crawler()