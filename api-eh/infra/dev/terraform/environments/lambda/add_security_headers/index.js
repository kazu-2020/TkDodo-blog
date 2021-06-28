"use strict";
exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  //Set new headers
  headers["strict-transport-security"] = [
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubdomains; preload"
    }
  ];

  // Set Secure for cookie
  if (headers.hasOwnProperty("set-cookie")) {
    for (const cookie of headers["set-cookie"]) {
      cookie.value += "; Secure";
    }
  }

  callback(null, response);
};
