# Mime Message Composer
Mime / Multipart message composer is a package that helps to encode the request body in a multipart message format. This composer helps to create the multipart encoded body like multipart/alternative.

## Info
This package works on a concept of content type. Every mutipart message hava a content type that describe what content it holds.  
This package exposes two classes:
 - **BranchableCT (Branchable Content Type)**  
   BranchableCT are those content type which have its boundary defined and will have multiple child content types within itself.  
   Example of BranchableCT are: `multipart/alternative`, `multipart/mixed`, and others
 - **BodyCT (Body Content Type)**  
   BodyCT are those content type which contains body/value in as its body with required headers and cannot have additional content types in its body.  
   Example of BodyCT are: `text/plain`, `application/json`, and others
   
 #
 ## Docs
   **BranchableCT**
   - Constructor:
   ```TS
   BranchableCT(ContentType:String, Boundary:String) - E.g: BranchableCT("multipart/alternative","alt_part1")
   ```
   - Methods:
   ```TS
   appendHeaders(headers: HeaderType[]):this - E.g appendHeaders([{name:"Content-Transfer-Encoding",value:"base64"}])
   
   - HeaderType is a Object that has name and value property.
   - Used to add headers to the content type.
   ```
   ```TS
   addBranches(branches: ContentTypeI[]):this - E.g: addBranches([new BranchableCT(..), new BodyCT(..)])
   
   - Add subBranch of this content type
   - Both Branchable and Body Interface implements ContentTypeI.
   ```
   ```TS
   compile():string - E.g: compile()
   
   - Generate the compiled Mime message of this content type by combining with headers and branches.
   ```
   
   **BodyCT**
   - Constructor:
   ```TS
   BodyCT(ContentType:String, additionalCT: HeaderType) - E.g BodyCT("application/json",{name:"name",value:"package.json"})
   ```
   - Methods:
   ```TS
   appendHeaders(headers: HeaderType[]):this - E.g appendHeaders([{name:"Content-Transfer-Encoding",value:"base64"}])
   
   - HeaderType is a Object that has name and value property.
   - Used to add headers to the content type.
   ```
   ```TS
   getBody():string - eg getBody()
   
   - Get Body data added to this content type class
   ```
   ```TS
   setBody(data: string):this - E.g: setBody("any data depending on headers")
   
   - Add body data to the content type.
   ```
   ```TS
   compile():string - E.g: compile()
   
   - Generate the compiled Mime message of this content type by combining with headers and branches.
   ```
   
   #
   ## Usage
   ```js
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

   // Base CT
   const alternative = new BranchableCT({
     contentType: "multipart/alternative",
     boundary: "foo-bar"
   }).appendHeaders([
     {
       name: "From",
       value: "from@email.com"
     },
     {
       name: "To",
       value: "to@email.com"
     },
     {
       name: "Encoding",
       value: "7bit"
     }
   ]).addBranches([textPlain, textHtml]);
   
   console.log(alternative.compile())
   ```
   **Output:**
   ```
   Content-Type: multipart/alternative; boundary="foo-bar"
   From: "from@email.com
   To: "to@email.com"
   Encoding: 7bit

   --foo-bar
   Content-Type: text/plain; charset="UTF-8"
   Content-Transfer-Encoding: 7bit

   this is plain text body
   --foo-bar
   Content-Type: text/html; charset="UTF-8"
   Content-Transfer-Encoding: 7bit

   <b>this is plain text body</b>
   --foo-bar--
   ```
   #
   ## Links
   - [**RFC1341**](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html)
