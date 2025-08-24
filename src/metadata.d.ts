export declare function generateTokenNameAndSymbol(): {
    name: string;
    symbol: string;
};
export declare function generateTokenDescription(name: string, symbol: string): string;
export declare function uploadImageAndGetUri(name: string, symbol: string): Promise<string>;
export declare function generateAndUploadMetadata(name: string, symbol: string, description: string, imageUrl: string): Promise<string>;
//# sourceMappingURL=metadata.d.ts.map