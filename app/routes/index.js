const s3list = require("../util/getList");
const s3object = require("../util/getObject");
const getS3Url = require("../util/getTempUrl");

module.exports = (app) => {
  app.use("/s3list", s3list.s3Object);
  app.use("/s3object", s3object.getS3Object);
  app.use("/s3url", getS3Url.getS3Url);
  app.use("/s3objectversionlist", s3object.getS3ObjectVersionList);
  app.use("/s3objectversion", s3object.getS3ObjectVersion);
  require("../util/fileupload")(app);
};
