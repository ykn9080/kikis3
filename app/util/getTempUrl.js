const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
});

// Tried with and without this. Since s3 is not region-specific, I don't
// think it should be necessary.
// AWS.config.update({region: 'us-west-2'})

exports.getS3Url = async (req, res) => {
  const bd = req.body;
  console.log(bd);
  AWS.config.update({ region: bd.region });

  let signedUrlExpireSeconds = 60 * 5;
  if (bd.expireseconds) signedUrlExpireSeconds = bd.expireseconds;
  if (bd.vesionId) VersionId = bd.versionId;
  const param = {
    Bucket: bd.bucketname,
    Key: bd.key,
    Expires: signedUrlExpireSeconds,
  };
  const url = s3.getSignedUrl("getObject", param);
  res.status(200).send(url);
};
exports.getS3UrlMultiple = (req, res) => {
  const bd = req.body;
  console.log(bd);
  //AWS.config.update({ region: bd.region });

  let signedUrlExpireSeconds = 60 * 5;
  let rtn = [];
  bd.map((k, i) => {
    if (k.expireseconds) signedUrlExpireSeconds = k.expireseconds;
    if (k.vesionId) VersionId = k.versionId;
    const param = {
      Bucket: k.bucketname,
      Key: k.key,
      Expires: signedUrlExpireSeconds,
    };
    const url = s3.getSignedUrl("getObject", param);
    rtn.push(url);
  });

  res.status(200).send(rtn);
};
