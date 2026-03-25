export interface IFetchApi{
    success: boolean;
    message: string;
}


export interface IFetchApiResult<TResult> extends IFetchApi {
    result: TResult;
}