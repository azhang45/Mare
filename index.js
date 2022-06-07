
// express
// jimp
const express = require("express")
const exphbs = require("express-handlebars")
const multer = require("multer")
const fs = require('fs');
const path = require("path")
const app = express()

const fileSizeLimit = 10000000; // The limit on the file's size in bytes
const fileLifeTime = 1000 * 60 * 60; // The time until the file is deleted from the server in milliseconds
const uploadsPath = './public/uploads/';

app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

/**
 *  Source code for multer configuration
 * 
 * function(req, file, cb) {
    cb(null, path.join(__dirname, "/uploads"))
  }
 */
var storage = multer.diskStorage({
  destination: uploadsPath,
  filename: function (req, file, cb) {
    fileExtension = file.originalname.split(".")[1]
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
  },
})
const upload = multer({
  storage: storage,
  limits: { fileSize: fileSizeLimit },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('img');

var fileName;
var mareFileName;

// Only allow image files
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const minetype = filetypes.test(file.mimetype);

  if (minetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");

  }
}

// On startup, delete all files that have been uploaded
fs.readdir(uploadsPath, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(uploadsPath, file), err => {
      if (err) throw err;
    });
  }
});

app.get("/", (req, res) => {
  res.render("home")
})
// app.post("/upload", upload.single("img"), (req, res) => {
//   let uploadedfile = req.file.fieldname
//   if (uploadedfile) {
//     res.json("file uploaded successfully")
//   }
// })

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {

    // If there is an error, show the message
    if (err) {
      res.render('home', {
        msg: err
      });
    }
    else {
      // If the user didn't upload a file and hasn't uploaded one in the past
      if (fileName == undefined && req.file == undefined) {
        res.render('home', {
          msg: "Error: Upload a file first!"
        });
      }
      // If the file uploaded successfully
      else {
        if (req.file != undefined) {
          fileName = `public/uploads/${req.file.filename}`;
          var localFileName = `uploads/${req.file.filename}`;
          mareFileName = `public/uploads/mare_${req.file.filename}`;

          // Delete the files after one hour
          setTimeout(function () {
            fs.unlink(fileName, (err) => {
              if (err) {
                console.error(err)
                return;
              }
            });
            fs.unlink(mareFileName, (err) => {
              if (err) {
                console.error(err)
                return;
              }
            });
          }, fileLifeTime);
        }
          //manipulateImage(fileName);
        res.render('home', {imgPath: localFileName})
      }


    }
  });

});

// function manipulateImage(fileName)
// {
//   // do stuff
// }

app.listen(process.env.PORT||5000);