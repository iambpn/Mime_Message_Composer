// @ts-check
/**
 * Creating Multipart Alternative body
 */

const { BodyCT, BranchableCT } = require("../dist");

const textPlain = new BodyCT({
  contentType: "text/plain",
  inlineHeader: {
    name: "charset",
    value: "UTF-8",
  },
})
  .appendHeaders([
    {
      name: "Content-Transfer-Encoding",
      value: "7bit",
    },
  ])
  .setBody("this is plain text body");

const textHtml = new BodyCT({
  contentType: "text/html",
  inlineHeader: {
    name: "charset",
    value: "UTF-8",
  },
})
  .appendHeaders([
    {
      name: "Content-Transfer-Encoding",
      value: "7bit",
    },
  ])
  .setBody("<b>this is plain text body</b>");

const alternative = new BranchableCT({
  contentType: "multipart/alternative",
  boundary: "foo-bar",
})
  .appendHeaders([
    {
      name: "Encoding",
      value: "7bit",
    },
  ])
  .addBranches([textPlain, textHtml]);

console.log(alternative.compile());
