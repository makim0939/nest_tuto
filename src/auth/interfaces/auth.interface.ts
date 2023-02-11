// 認証で使用するデータ型を作成

//
export interface Msg {
    message: string;
}
//
export interface Csrf {
    csrfToken: string;
}
//
export interface Jwt {
    access_token: string
}