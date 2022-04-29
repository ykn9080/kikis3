// fileUpload.js

let fs = require("fs");
var aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3");

module.exports = (app) => {
  //const upload = multer({ dest: "./media" });
  //   app.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
  //     var img = fs.readFileSync(req.file.path);
  //     var encode_img = img.toString('base64');
  //     var final_img = {
  //         contentType:req.file.mimetype,
  //         image:new Buffer(encode_img,'base64')
  //     };
  //     image.create(final_img,function(err,result){
  //         if(err){
  //             console.log(err);
  //         }else{
  //             console.log(result.img.Buffer);
  //             console.log("Saved To database");
  //             res.contentType(final_img.contentType);
  //             res.send(final_img.image);
  //         }
  //     })
  // })

  // aws.config.update({
  //   accessKeyId: process.env.AWS_IAM_USER_KEY,
  //   secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  //   Bucket: process.env.AWS_BUCKET_NAME,
  // });

  // var s3 = new aws.S3();

  const accessKeyId = process.env.AWS_IAM_USER_KEY;
  const secretAccessKey = process.env.AWS_IAM_USER_SECRET;

  const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
  });
  // var upload = multer({
  //   storage: multerS3({
  //     s3: s3,
  //     acl: "public-read",
  //     bucket: process.env.AWS_BUCKET_NAME,
  //     key: function (req, file, cb) {
  //       console.log(file);
  //       cb(null, file.originalname); //use Date.now() for unique file keys
  //     },
  //   }),
  // });
  var upload = multer({
    storage: multerS3({
      s3: s3,
      // acl: "public-read",
      //bucket: process.env.AWS_BUCKET_NAME,
      bucket: function (req, file, cb) {
        console.log(" bucketName is >> ", file);
        cb(null, req.body.bucketname);
      },
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        console.log("key", file.originalname);
        cb(null, file.originalname);
      },
      // contentType: multerS3.AUTO_CONTENT_TYPE,
      // contentDisposition: "attachment",
    }),
  });
  const multipleUpload = upload.fields([
    { name: "file1" },
    { name: "file2", maxCount: 3 },
  ]);
  //use by upload form
  app.post("/upload", upload.array("file", 3), function (req, res, next) {
    res.send("Successfully uploaded " + req.files.length + " files!");
  });
  app.post("/multiupload", multipleUpload, function (req, res, next) {
    console.log(req.files);
    res.send("Successfully uploaded " + req + " files!");
  });

  // app.post("/upload", upload.single("profileImg"), function (req, res, next) {
  //   //app.post("/upload", upload.array("upl", 25), function (req, res, next) {
  //   console.log(req.body, req.files);
  //   res.send({
  //     message: "Uploaded!",
  //     urls: req.files.map(function (file) {
  //       return {
  //         url: file.location,
  //         name: file.key,
  //         type: file.mimetype,
  //         size: file.size,
  //       };
  //     }),
  //   });
  // });

  // app.post("/fileupload", (req, res) => {
  //   let path = req.query.path;
  //   if (!path) path = "./media";
  //   console.log(path);
  //   const storage = multer.diskStorage({
  //     destination: (req, file, callback) => {
  //       callback(null, `${path}`); //업로드 파일의 저장 위치를 설정
  //     },
  //     filename: (req, file, callback) => {
  //       callback(null, `${file.originalname}`); // 파일이 저장될 때 이름 설정
  //     },
  //   });

  //   const limits = {
  //     files: 50,
  //     fileSize: 1024 * 1024 * 1024, //1G
  //   };

  //   const upload = multer({ storage, limits }).any();

  //   const reqFiles = [];

  //   upload(req, res, (err) => {
  //     console.log(req.files);
  //     if (err) {
  //       return res.json({ success: false, err });
  //     }

  //     for (let i = 0; i < req.files.length; i++) {
  //       reqFiles.push(req.files[i].filename);
  //     }

  //     //reqFiles.push(req.file.fileName);

  //     return res.json({
  //       success: true,
  //       //url: req.file.destination,
  //       filename: reqFiles,
  //       //fileName:req.file.originalname
  //     });
  //   });
  //   return;
  // });
};
