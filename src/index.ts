/*
    Multipart Encoded Content Composer.
 */
const lf = '\n';

type HeaderType = {
    name: string,
    value: string
}

/**
 * (You can only add boundary string or additionalCT)
 *
 * contentType: Type of content it holds.
 *
 * boundary: Unique boundary string.
 *
 * additionalCT: Like charset="UTf-8", filename="name"
 */
type ContentTypeHeader = {
    contentType: string,
    boundary?: string,
    additionalCT?: HeaderType
}

interface ContentTypeI {
    appendHeaders: (headers: HeaderType[]) => this,
    _buildHeaders: () => string,
    compile: () => string
}

interface BranchableI extends ContentTypeI {
    addBranches: (branches: ContentTypeI[]) => this,
    _buildBranches: () => string
}

interface UnBranchableI extends ContentTypeI {
    setBody: (body: string) => this,
    getBody: () => string
}

abstract class ContentType implements ContentTypeI {
    private headers: HeaderType[] = [];

    /**
     * Constructor
     * @param CTHeader Content Type Header.
     *
     * {
     *     contentType:string,
     *     boundary?:string,
     *     additionalCT: HeaderType
     * }
     * @protected
     */
    protected constructor(CTHeader: ContentTypeHeader) {
        let value = "";
        if (CTHeader.boundary) {
            value = `${CTHeader.contentType}; boundary="${CTHeader.boundary}"`;
        } else if (CTHeader.additionalCT) {
            value = `${CTHeader.contentType}; ${CTHeader.additionalCT.name}="${CTHeader.additionalCT.value}"`;
        }

        this.headers.push({
            name: "Content-Type",
            value: value
        })
    }

    /**
     * Used to add headers to the content type.
     * @param headers
     *
     * {
     *     name:String,
     *     value:string
     * }
     */
    appendHeaders(headers: HeaderType[]): this {
        this.headers = this.headers.concat(headers);
        return this;
    }

    _buildHeaders(): string {
        return this.headers.map(header => `${header.name}: ${header.value}${lf}`)
            .join("")
    }

    abstract compile(): string
}

/**
 * BranchableCT (Content-Type): Those content type which have its boundary defined and have multiple child content types.
 * Example of BranchableCT are multipart/alternative, multipart/mixed, and others
 */
class BranchableCT extends ContentType implements BranchableI {
    private branches: ContentTypeI[] = [];
    private readonly boundary: string = "";

    /**
     * Constructor
     * @param CTHeader
     *
     * {
     *     contentType:string,
     *     boundary:string
     * }
     */
    constructor(CTHeader: ContentTypeHeader) {
        super(CTHeader)
        if (CTHeader.boundary) {
            this.boundary = CTHeader.boundary;
        } else {
            throw new Error("Branchable Class must have Boundary defined.")
        }
    }

    /**
     * Add subBranch of this content type. Sub branch will be added between boundary
     * @param branches
     */
    addBranches(branches: ContentTypeI[]): this {
        this.branches = [...branches];
        return this;
    }

    private startBoundary() {
        return `--${this.boundary}${lf}`;
    }

    private endBoundary() {
        return `--${this.boundary}--${lf}`;
    }

    _buildBranches(): string {
        return this.branches.map(branch => `${this.startBoundary()}${branch.compile()}${lf}`)
                .join("")
            + this.endBoundary();
    }

    /**
     * Generate the compiled string of this content type by combining with headers and branches.
     */
    compile(): string {
        return `${super._buildHeaders()}${lf}${this._buildBranches()}`;
    }
}

/**
 * BodyCT (Content-Type): Those content type which do not have additional with in itself.
 * Example of BodyCT are text/plain, application/json, and others
 */
class BodyCT extends ContentType implements UnBranchableI {
    private body: string = "";

    /**
     * Constructor
     * @param CTHeader
     *
     * {
     *     contentType:string,
     *     additionalCT: HeaderType
     * }
     */
    constructor(CTHeader: ContentTypeHeader) {
        super(CTHeader);
        if (CTHeader.boundary) {
            throw new Error("BodyCT Class should not define Boundary.")
        }
    }

    /**
     * get Body data added to this content type class.
     */
    getBody(): string {
        return this.body;
    }

    /**
     * Add body data to the content type.
     * @param data
     */
    setBody(data: string): this {
        this.body = data
        return this;
    }

    /**
     * Generate the compiled string of this content type along with headers and branches.
     */
    compile(): string {
        return `${super._buildHeaders()}${lf}${this.getBody()}`;
    }
}

export {BranchableCT, BodyCT};