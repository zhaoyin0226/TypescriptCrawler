import cheerio from 'cheerio'
import fs from 'fs'
import { IXXXCarwler } from './crawler'

interface IMovieRecord {
    name: string;
    Rank: number;
    star: number;
}
interface IResults {
    time: number;
    data: IMovieRecord[];
}
interface IJsonContent {
    [propName: number]: IMovieRecord[]
}
export default class DoubanCarwler implements IXXXCarwler {
    private static instance: DoubanCarwler

    public url = `https://movie.douban.com/top250?start=${this.start}&filter=`
    private MovieRecords: IMovieRecord[] = []

    static getInstance(start: number) {
        if (!DoubanCarwler.instance) {
            DoubanCarwler.instance = new DoubanCarwler(start)
        }
        DoubanCarwler.instance.url = `https://movie.douban.com/top250?start=${start}&filter=`
        DoubanCarwler.instance.start = start
        return DoubanCarwler.instance
    }
    constructor(private start: number) {
        this.start = start
        this.url = `https://movie.douban.com/top250?start=${start}&filter=`
    }
    private getJsonInfo(html: string) {
        const $ = cheerio.load(html)
        const hds = $('.hd')
        this.MovieRecords = []
        hds.map((k, v) => {
            // const titles = $(v).children('.title') records
            const titles = $(v).find('.title')
            this.MovieRecords.push({ name: titles.eq(0).text(), Rank: Number(this.start) + k + 1, star: 0 })
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
    private generateJsonContent(jsonInfos: IResults, filePath: string) {
        let fileContent: IJsonContent = {}
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        }
        fileContent[jsonInfos.time] = jsonInfos.data
        return fileContent
    }
    public douban(html: string, filePath: string) {
        const jsonInfos = this.getJsonInfo(html)
        const fileContent = this.generateJsonContent(jsonInfos, filePath)
        return JSON.stringify(fileContent)
    }
}