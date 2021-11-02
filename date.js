
exports.getDate = function (){
    const options = {year: "numeric", month: "long", day: "numeric"}
    const date = new Date().toLocaleDateString("en-US", options)
    return date
}

exports.getDay = function (){
    const options = {weekday: "long"}
    const date = new Date().toLocaleDateString("en-US", options)
    return date
}


