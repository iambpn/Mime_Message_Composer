"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyCT = exports.BranchableCT = void 0;
const lf = '\n';
class ContentType {
    constructor(CTHeader) {
        this.headers = [];
        let value = "";
        if (CTHeader.boundary) {
            value = `${CTHeader.contentType}; boundary="${CTHeader.boundary}"`;
        }
        else if (CTHeader.additionalCT) {
            value = `${CTHeader.contentType}; ${CTHeader.additionalCT.name}="${CTHeader.additionalCT.value}"`;
        }
        this.headers.push({
            name: "Content-Type",
            value: value
        });
    }
    appendHeaders(headers) {
        this.headers = this.headers.concat(headers);
        return this;
    }
    _buildHeaders() {
        return this.headers.map(header => `${header.name}: ${header.value}${lf}`)
            .join("");
    }
}
class BranchableCT extends ContentType {
    constructor(CTHeader) {
        super(CTHeader);
        this.branches = [];
        this.boundary = "";
        if (CTHeader.boundary) {
            this.boundary = CTHeader.boundary;
        }
        else {
            throw new Error("Branchable Class must have Boundary defined.");
        }
    }
    addBranches(branches) {
        this.branches = [...branches];
        return this;
    }
    startBoundary() {
        return `--${this.boundary}${lf}`;
    }
    endBoundary() {
        return `--${this.boundary}--${lf}`;
    }
    _buildBranches() {
        return this.branches.map(branch => `${this.startBoundary()}${branch.compile()}${lf}`)
            .join("")
            + this.endBoundary();
    }
    compile() {
        return `${super._buildHeaders()}${lf}${this._buildBranches()}`;
    }
}
exports.BranchableCT = BranchableCT;
class BodyCT extends ContentType {
    constructor(CTHeader) {
        super(CTHeader);
        this.body = "";
        if (CTHeader.boundary) {
            throw new Error("BodyCT Class should not define Boundary.");
        }
    }
    getBody() {
        return this.body;
    }
    setBody(data) {
        this.body = data;
        return this;
    }
    compile() {
        return `${super._buildHeaders()}${lf}${this.getBody()}`;
    }
}
exports.BodyCT = BodyCT;
