function getDate() {
    // let date1 = new Date();
    // return `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}  ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
    let date = new Date()
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let week = date.getDay();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    // console.log(second)
    let weekMap = {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "0": "天",
    }

    let newArr = [year, month, day, hour, minute, second].map(item => {
        return item.toString().padStart(2, 0)
    });
    [year, month, day, hour, minute, second] = newArr
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second} 星期${weekMap[week]}`

}

module.exports = {
    getDate
}