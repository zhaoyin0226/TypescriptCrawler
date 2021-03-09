function fn1<T,P>(param: T): P{
    return <P><any>param
}
const res = fn1<string,number>('1')
console.log('res is --',typeof res) // string