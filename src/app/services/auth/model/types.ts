export interface User {
    id: string,
    nameAndSurname: string,
    email: string;
    password: string;
    accountAmount: number;
}


export interface LoginInfo {
    email: string;
    password: string;
}
