export default interface IResponse<T> {
    data: T;
    message?: string;
    errors?: Record<string, Array<string>>;
    statusCode?: number;
}
