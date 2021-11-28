declare type HeaderType = {
    name: string;
    value: string;
};
declare type ContentTypeHeader = {
    contentType: string;
    boundary?: string;
    additionalCT?: HeaderType;
};
interface ContentTypeI {
    appendHeaders: (headers: HeaderType[]) => this;
    _buildHeaders: () => string;
    compile: () => string;
}
interface BranchableI extends ContentTypeI {
    addBranches: (branches: ContentTypeI[]) => this;
    _buildBranches: () => string;
}
interface UnBranchableI extends ContentTypeI {
    setBody: (body: string) => this;
    getBody: () => string;
}
declare abstract class ContentType implements ContentTypeI {
    private headers;
    protected constructor(CTHeader: ContentTypeHeader);
    appendHeaders(headers: HeaderType[]): this;
    _buildHeaders(): string;
    abstract compile(): string;
}
declare class BranchableCT extends ContentType implements BranchableI {
    private branches;
    private readonly boundary;
    constructor(CTHeader: ContentTypeHeader);
    addBranches(branches: ContentTypeI[]): this;
    private startBoundary;
    private endBoundary;
    _buildBranches(): string;
    compile(): string;
}
declare class BodyCT extends ContentType implements UnBranchableI {
    private body;
    constructor(CTHeader: ContentTypeHeader);
    getBody(): string;
    setBody(data: string): this;
    compile(): string;
}
export { BranchableCT, BodyCT };
