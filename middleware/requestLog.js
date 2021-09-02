function request_log(req,res,next){
    let request_log = `${req.method} - ${req.path}`;
    console.log(request_log)
    next();
}

module.exports = request_log;