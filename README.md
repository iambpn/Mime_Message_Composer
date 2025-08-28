# Mime Message Composer

Mime / Multipart message composer is a package that helps to encode the request body in a multipart message format. This composer helps to create the multipart encoded body like multipart/alternative.

## Install using NPM

`npm i mime_message_composer`

## Info

This package works on a concept of content type. Every mutipart message hava a content type that describe what content it holds. This package exposes two classes:

- **BranchableCT (Branchable Content Type)**

  BranchableCT are those content type which have its boundary defined and will have multiple child content types within itself. Example of BranchableCT are: `multipart/alternative`, `multipart/mixed`, and others

- **BodyCT (Body Content Type)**

  BodyCT are those content type which contains body/value in as its body with required headers and cannot have additional content types in its body. Example of BodyCT are: `text/plain`, `application/json`, and others

---

## Docs

### Classes

#### `BranchableCT`

Represents a multipart content type (e.g., `multipart/alternative`, `multipart/mixed`) that can contain multiple child content types.

**Constructor:**

```typescript
new BranchableCT({
  contentType: string, // e.g., "multipart/alternative"
  boundary: string, // required boundary string
  inlineHeader: HeaderType, // optional inline header
});
```

**Methods:**

- `appendHeaders(headers: HeaderType[]): this` Appends additional headers to the content type.

- `addBranches(branches: ContentTypeI[]): this` Adds child content types (branches) to this multipart content.

- `compile(): string` Compiles the content type, headers, and branches into a MIME-formatted string.

---

#### `BodyCT`

Represents a leaf/sub content type (e.g., `text/plain`, `application/json`) that contains only a body and headers.

**Constructor:**

```typescript
new BodyCT({
  contentType: string, // e.g., "text/plain"
  inlineHeader: HeaderType, // optional inline header
});
```

**Methods:**

- `appendHeaders(headers: HeaderType[]): this` Appends additional headers to the content type.

- `setBody(body: string): this` Sets the body content for this content type.

- `getBody(): string` Returns the body content.

- `compile(): string` Compiles the content type, headers, and body into a MIME-formatted string.

---

#### `HeaderType`

```typescript
type HeaderType = {
  name: string;
  value: string;
};
```

#### `ContentTypeHeader`

```typescript
type ContentTypeHeader = {
  contentType: string;
  boundary?: string;
  inlineHeader?: HeaderType;
};
```

---

### Example Usage

```js
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

---

## Links

- [**RFC1341**](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html)
