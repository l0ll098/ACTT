export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface OfflineAction {
    id?: number;
    method: HttpMethods;
    url: string;
    headers?: object;
    body?: object;
}
