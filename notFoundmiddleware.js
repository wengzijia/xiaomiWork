const path = require('path');
let notFound = (req,res,next) => {
    res.status(404).sendFile(path.join(__dirname,'404.html'))
}

module.exports = notFound