/**
 * Creating Multipart Mixed body
 */

const {BranchableCT, BodyCT} = require("../");

const textPlain = new BodyCT({
    contentType: "text/plain",
    additionalCT: {
        name: "charset",
        value: "UTF-8"
    }
}).appendHeaders([
    {
        name: "Content-Transfer-Encoding",
        value: "7bit"
    }
]).setBody("this is plain text body");

const textHtml = new BodyCT({
    contentType: "text/html",
    additionalCT: {
        name: "charset",
        value: "UTF-8"
    }
}).appendHeaders([
    {
        name: "Content-Transfer-Encoding",
        value: "7bit"
    }
]).setBody("<b>this is plain text body</b>");

const alt = new BranchableCT({
    contentType: "multipart/alternative",
    boundary: "foo-bar"
}).appendHeaders([
    {
        name: "Encoding",
        value: "7bit"
    }
]).addBranches([textPlain, textHtml]);

const attachment1 = new BodyCT({
    contentType: "application/json",
    additionalCT: {
        name: "name",
        value: "Package.json"
    }
}).appendHeaders([
    {
        name: "Content-Transfer-Encoding",
        value: "base64"
    },
    {
        name: "Content-Disposition",
        value: "attachment; filename=package.json"
    }
]).setBody("ewogICJuYW1lIjogIm1haWxwYXJzZXIiLAogICJ2ZXJzaW9uIjogIjEuMC4wIiwKICAiZGVzY3Jp\n" +
    "cHRpb24iOiAiIiwKICAibWFpbiI6ICJpbmRleC5qcyIsCiAgInNjcmlwdHMiOiB7CiAgICAidGVz\n" +
    "dCI6ICJlY2hvIFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXCIgJiYgZXhpdCAxIgogIH0sCiAg\n" +
    "ImtleXdvcmRzIjogW10sCiAgImF1dGhvciI6ICIiLAogICJsaWNlbnNlIjogIklTQyIsCiAgImRl\n" +
    "cGVuZGVuY2llcyI6IHsKICAgICJnbWFpbC1hcGktY3JlYXRlLW1lc3NhZ2UtYm9keSI6ICJeMS4w\n" +
    "LjAiLAogICAgImdtYWlsLWFwaS1wYXJzZS1tZXNzYWdlIjogIl4yLjEuMiIsCiAgICAibWFpbHBh\n" +
    "cnNlciI6ICJeMy40LjAiLAogICAgIm5vZGVtYWlsZXIiOiAiXjYuNy4yIgogIH0KfQo=");

const mixed = new BranchableCT({
    contentType: "multipart/mixed",
    boundary: "foo-bar-baz"
}).appendHeaders([
    {
        name: "To",
        value: "bopon.maharjan@gmail.com"
    },
    {
        name: "From",
        value: "maharjan.bipin@blm.co.jp"
    },
    {
        name: "Subject",
        value: "alter text"
    },
    {
        name: "Mime-Version",
        value: "1.0"
    }
]).addBranches([alt, attachment1])

console.log(mixed.compile());