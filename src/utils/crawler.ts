import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
// import DoubanCarwler from './doubanCarwler'

export interface IXXXCarwler {
    douban: (html: string, filePath: string) => string;
    url: string;
}

class Crawler {
    // private start = 0
    // private url = `https://movie.douban.com/top250?start=${this.start}&filter=`

    private filePath = path.resolve(__dirname, '../../data/results.json')

    private async getRawHtml() {
        const result = await superagent.get(this.doubanCarwler.url)
        return result.text
    }

    private wirteFile(content: string) {
        fs.writeFileSync(this.filePath, content)
    }
    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        const fileContent = this.doubanCarwler.douban(html, this.filePath)
        this.wirteFile(fileContent)
    }
    constructor(private doubanCarwler: IXXXCarwler) {
        this.initSpiderProcess()
    }
}
// const doubanCarwler = new DoubanCarwler(50)
// const doubanCarwler = DoubanCarwler.getInstance(0)
// new Crawler(doubanCarwler)

export default Crawler