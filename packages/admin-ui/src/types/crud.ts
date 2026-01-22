export interface UseCrudOptions {
    baseUrl: string;
    resource: string;
    pageSize?: number;
    pageSizeOptions?: number[];
    headers?: Record<string, string>;
    autoRefresh?: boolean;
}
