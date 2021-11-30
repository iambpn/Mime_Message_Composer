# Mime Message Composer
Mime / Multipart message composer is a package that helps to encode the request body in a multipart message format. This composer helps to create the multipart encoded body like multipart/alternative.

## Info
This package works on a concept of content type. Every mutipart message hava a content type that describe what content it holds.  
This package exposes two classes:
 - **BranchableCT (Branchable Content Type)**  
   Those content type which have its boundary defined and have multiple child content types.  
   Example of BranchableCT are: `multipart/alternative`, `multipart/mixed`, and others
 - **BodyCT (Body Content Type)**  
   Those content type which do not have additional with in itself.  
   Example of BodyCT are: `text/plain`, `application/json`, and others
   
 #
 ## Docs
   **BranchableCT**
   - Constructor:
   ```
   BranchableCT(ContentType:String, Boundary:String) - E.g: BranchableCT("multipart/alternative","alt_part1")
   ```
   - Methods:
   ```
   appendHeaders(headers: HeaderType[]):this - E.g appendHeaders([{name:"Content-Transfer-Encoding",value:"base64"}])
   
   - HeaderType is a Object that has name and value property.
   - Used to add headers to the content type.
   ```
   ```
   addBranches(branches: ContentTypeI[]):this - E.g: addBranches([new BranchableCT(..), new BodyCT(..)])
   
   - Add subBranch of this content type
   - ContentTypeI interface is implemented by both Branchable and Body Interface.
   ```
   ```
   compile():string - E.g: compile()
   
   - Generate the compiled Mime message of this content type by combining with headers and branches.
   ```
   
   **BodyCT**
   - Constructor:
   ```
   BodyCT(ContentType:String, additionalCT: HeaderType) - E.g BodyCT("application/json",{name:"name",value:"package.json"})
   ```
   - Methods:
   ```
   appendHeaders(headers: HeaderType[]):this - E.g appendHeaders([{name:"Content-Transfer-Encoding",value:"base64"}])
   
   - HeaderType is a Object that has name and value property.
   - Used to add headers to the content type.
   ```
   ```
   getBody():string - eg getBody()
   
   - Get Body data added to this content type class
   ```
   ```
   setBody(data: string):this - E.g: setBody("any data depending on headers")
   
   - Add body data to the content type.
   ```
   ```
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

   const alternative = new BranchableCT({
     contentType: "multipart/alternative",
     boundary: "foo-bar"
   }).appendHeaders([
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
