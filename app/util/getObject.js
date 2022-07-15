// using v2.x of aws-sdk
var AWS = require("aws-sdk");

require("dotenv").config();

let s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
});

exports.getS3Object = async (req, res) => {
  const bd = req.body;
  console.log(bd);
  AWS.config.update({ region: bd.region });

  // Create S3 service object
  // s3 = new AWS.S3();

  try {
    const params = {
      Bucket: bd.bucketname,
      Key: bd.key,
    };
    s3.getObject(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);
        if (data.ContentType && data.ContentType.split("/")[0] === "image") {
          res.status(200).send(data.Body.toString("base64"));
        } else {
          res.status(200).send(data.Body.toString("utf-8"));
        }
      }
    });
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};

//const s3 = new aws.S3();
exports.getS3ObjectVersion = async (req, res) => {
  const bd = req.body;
  console.log(bd);
  AWS.config.update({ region: bd.region });

  // Create S3 service object
  //s3 = new AWS.S3();
  let params = {
    Bucket: bd.bucketname,
    Key: bd.key,
  };
  if (bd.versionId) params.VersionId = bd.versionid;
  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);
    res.status(200).send(data);
  });

  // res.status(200).send(getObject());
  // async function getObject() {
  //   try {
  //     const params = {
  //       Bucket: bd.bucketname,
  //       Key: `${bd.key}?versionId=${bd.versionid}`,
  //     };
  //     const data = await s3.getObject(params).promise();
  //     //return data.Body.toString("utf-8");
  //     return data;
  //   } catch (e) {
  //     throw new Error(`Could not retrieve file from S3: ${e.message}`);
  //   }
  // }
};

exports.getS3ObjectVersionList = async (req, res) => {
  const bd = req.body;
  console.log(bd);
  AWS.config.update({ region: bd.region });

  // Create S3 service object
  s3 = new AWS.S3();

  try {
    const params = {
      Bucket: bd.bucketname,
      Prefix: bd.prefix,
    };
    s3.listObjectVersions(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);
      res.status(200).send(data);
    });

    //const data = await s3.getObject(params).promise();

    // // Check for image payload and formats appropriately
    // if (data.ContentType === "image/jpeg") {
    //   return data.Body.toString("base64");
    // } else {
    //   return data.Body.toString("utf-8");
    // }
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
};
