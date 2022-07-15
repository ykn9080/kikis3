// fileUpload.js

let fs = require("fs");
var aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3");

module.exports = (app) => {

  const accessKeyId = process.env.AWS_IAM_USER_KEY;
  const secretAccessKey = process.env.AWS_IAM_USER_SECRET;

  const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
  });

  var upload = multer({
    storage: multerS3({
      s3: s3,
      // acl: "public-read",
      //bucket: process.env.AWS_BUCKET_NAME,
      bucket: function (req, file, cb) {
        console.log(" bucketName is >> ", file, req.body.bucketname);
        cb(null, req.body.bucketname);
      },
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        console.log("key", file, req.body);
        let savename = file.originalname;
        let prefix = req.body.prefix;
        if (prefix) {
          prefix = JSON.parse(prefix);
          prefix = prefix[file.fieldname];
          console.log("prefix is ", prefix);
          if (prefix) {
            savename = prefix + "/" + savename;
          }
        }
        cb(null, savename);
      },
      contentEncoding: "base64",
      // contentType: multerS3.AUTO_CONTENT_TYPE
      // contentDisposition: "attachment",
    }),
  });

  let arr = [],
    i;
  for (i = 1; i < 13; i++) {
    arr.push({ name: `file${i}`, maxCount: 1 });
  }
  const multipleUpload = upload.fields(arr);

  //use by upload form
  app.post("/upload", upload.array("file", 3), function (req, res, next) {
    res.send("Successfully uploaded " + req.files.length + " files!");
  });
  app.post("/multiupload", multipleUpload, function (req, res, next) {
    console.log("req.files ", req.files, "req.body:", req.body);
    res.send("Successfully uploaded " + req + " files!");
  });
  app.post("/multiupload1",  function (req, res, next) {
    console.log("req.files ", req.files, "req.body:", req.body);
    res.send("Successfully uploaded " + req + " files!");
  });

};
