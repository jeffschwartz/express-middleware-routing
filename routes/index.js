/*
 * GET home page.
 */

exports.index = function(req, res){
  var mongoDb = req.mongoDb;
  var expose = "";
  if(mongoDb){
    expose = "index route has access to mongo";
  }else{
    expose = "index route doesn't have access to mongo";
  }
  res.render('index', { title: 'Express', expose: expose });
};