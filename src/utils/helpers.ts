export const buildV1AppPath = (path: string) => {
    return `/api/v1/${path}`;
}

export const buildBasePath = () => {
    return `/`;
}


export const BASE_CLIENT = process.env.BASE_CLIENT