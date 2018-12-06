const path = require('path')
const fs = require('fs')

const Express = require('express')
const multer = require('multer')

const app = new Express()
const PORT = 8777

app.use( Express.static('static') )

//上传配置
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})


//jsonp形式上传文件
app.post('/upload', upload.single('upload'), function (req, res) {
  const callback = req.query.callback
  const data = '"form上传成功"'

  res.send(
    '<script>window.top.window["'
    + callback
    + '"]('
    + data
    + ');</script>')
})


//formData形式上传文件
app.post('/upload_formData', upload.single('upload'), function (req, res) {
  const data = '"formData上传成功"'
  res.send(data)
})


//下载文件
app.get('/file/:fileName', function(req, res, next) {
  // 实现文件下载
  var fileName = req.params.fileName
  var filePath = path.join(__dirname, './static', fileName)
  var stats = fs.statSync(filePath)
  if(stats.isFile()){
    console.log(fileName)
    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'inline; filename='+fileName,
      // 'Content-Disposition': 'attachment; filename='+fileName,
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res)
  } else {
    res.end(404)
  }
})


app.listen(PORT)
console.log('服务已启动，端口：' + PORT)