
// express
// jimp
const express = require("express")
const exphbs = require("express-handlebars")
const multer = require("multer")
const path = require("path")
const app = express()
/**
 *  Source code for multer configuration
 */
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "/uploads"))
  },
  filename: function(req, file, cb) {
    console.log("file", file)
    fileExtension = file.originalname.split(".")[1]
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
  },
})
var upload = multer({ storage: storage })


app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.get("/", (req, res) => {
  res.render("home")
})
app.post("/upload", upload.single("img"), (req, res) => {
  let uploadedfile = req.file.fieldname
  if (uploadedfile) {
    res.json("file uploaded successfully")
  }
})

app.listen(5000);