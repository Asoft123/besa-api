export type AuthType = {
    userData: { id: string, name: string,},
    iat: number,
    exp: number,
};

export type AuthInviteType = {
    userData: { id: string, name?: string, email?:string},
    iat: number,
    exp: number,
};