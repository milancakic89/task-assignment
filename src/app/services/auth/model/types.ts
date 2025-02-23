export interface User {
    id?: number,
    nameAndSurname: string,
    email: string;
    password: string;
    accountAmount: number;
}


export interface LoginInfo {
    email: string;
    password: string;
}
