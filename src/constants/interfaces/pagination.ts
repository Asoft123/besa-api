export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
    status?:string
}