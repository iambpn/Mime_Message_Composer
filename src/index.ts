const lf = "\n";

type HeaderType = {
  name: string;
  value: string;
};

type ContentTypeHeader = {
  contentType: string;
  boundary?: string;
  inlineHeader?: HeaderType;
};

interface ContentTypeI {
  // Additional headers to the content type
  appendHeaders: (headers: HeaderType[]) => this;
  _buildHeaders: () => string;
  compile: () => string;
}

interface BranchableI extends ContentTypeI {
  addBranches: (branches: ContentTypeI[]) => this;
  _buildBranches: () => string;
}

interface NonBranchableI extends ContentTypeI {
  setBody: (body: string) => this;
  getBody: () => string;
}

abstract class ContentType implements ContentTypeI {
  private additionalHeaders: HeaderType[] = [];

  protected constructor(CTHeader: ContentTypeHeader) {
    let value = "";
    if (CTHeader.boundary) {
      value = `${CTHeader.contentType}; boundary="${CTHeader.boundary}"`;
    } else if (CTHeader.inlineHeader) {
      value = `${CTHeader.contentType}; ${CTHeader.inlineHeader.name}="${CTHeader.inlineHeader.value}"`;
    }

    this.additionalHeaders.push({
      name: "Content-Type",
      value: value,
    });
  }

  appendHeaders(headers: HeaderType[]): this {
    this.additionalHeaders = this.additionalHeaders.concat(headers);
    return this;
  }

  _buildHeaders(): string {
    return this.additionalHeaders.map((header) => `${header.name}: ${header.value}${lf}`).join("");
  }

  abstract compile(): string;
}

/**
 * Those content type which have its boundary defined and have multiple child content types.
 * Example of BranchableCT are multipart/alternative, multipart/mixed, and others
 */
class BranchableCT extends ContentType implements BranchableI {
  private branches: ContentTypeI[] = [];
  private readonly boundary: string = "";

  constructor(CTHeader: ContentTypeHeader) {
    super(CTHeader);
    if (CTHeader.boundary) {
      this.boundary = CTHeader.boundary;
    } else {
      throw new Error("Branchable Class must have Boundary defined.");
    }
  }

  /**
   * Add branch to this content type
   */
  addBranches(branches: ContentTypeI[]): this {
    this.branches = [...branches];
    return this;
  }

  /**
   * Get the starting boundary string
   */
  private getStartBoundary() {
    return `--${this.boundary}${lf}`;
  }

  /**
   * Get the ending boundary string
   */
  private getEndBoundary() {
    return `--${this.boundary}--${lf}`;
  }

  /**
   * Generate the compiled string of all branches added to this content type
   */
  _buildBranches(): string {
    return (
      this.branches.map((branch) => `${this.getStartBoundary()}${branch.compile()}${lf}`).join("") +
      this.getEndBoundary()
    );
  }

  /**
   * Generate the compiled string of this content type along with headers and branches.
   */
  compile(): string {
    return `${super._buildHeaders()}${lf}${this._buildBranches()}`;
  }
}

/**
 * Those content type which do not have sub-contentType with-in itself.
 * Example of BodyCT are text/plain, application/json, and others
 */
class BodyCT extends ContentType implements NonBranchableI {
  private body: string = "";

  constructor(CTHeader: ContentTypeHeader) {
    super(CTHeader);
    if (CTHeader.boundary) {
      throw new Error("BodyCT Class should not define Boundary.");
    }
  }

  /**
   * get Body data added to this content type class.
   */
  getBody(): string {
    return this.body;
  }

  /**
   * Add body data to the content type
   */
  setBody(data: string): this {
    this.body = data;
    return this;
  }

  /**
   * Generate the compiled string of this content type along with headers and branches.
   */
  compile(): string {
    return `${super._buildHeaders()}${lf}${this.getBody()}`;
  }
}

export { BranchableCT, BodyCT };
