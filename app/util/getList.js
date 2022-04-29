// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

require("dotenv").config();

// const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
});
// const config = {
//   region: "ap-northeast-2",
//   credentials: {
//     accessKeyId: "AKIAZ4VEHXXIIPEOUA54",
//     secretAccessKey: "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",
//   },
// };

exports.s3Object = (req, res) => {
  const bd = req.body;
  console.log(bd);
  AWS.config.update({ region: bd.region });

  // Create S3 service object
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  // Create the parameters for calling listObjects
  var bucketParams = {
    Bucket: bd.bucketname,
  };

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(400).send(err);
    }
    console.log("Success", data);

    return res.status(200).send(data);
  });
};
