// import { PaginationParams } from '@mopos/constants/interfaces/pagination';
import { PaginationParams } from '@mopos/constants/interfaces/pagination';
import sequelize from 'sequelize';
import { FindOptions, Op } from 'sequelize';

export function getPagination(query: PaginationParams): { limit: number, offset: number } {
    const limit = query.pageSize ? +query.pageSize : 10;
    const page = query.page ? +query.page : 1;
    const offset = (page - 1) * limit;
    
    return { limit, offset };
}

export function getSorting(query: PaginationParams): { order: [[string, string]] } {
    const sortBy = query.sort ? query.sort : 'name';
    const sortOrder = query.order ? query.order : 'ASC';
    
    return { order: [[sortBy, sortOrder]] };
}

export function getSearch(query: PaginationParams): FindOptions {

const statusSearch = query.status ? String(query.status).toLowerCase() : '';
const searchPattern = query.search ? String(query.search).toLowerCase() : '';

        if(query.status && !query.search) {
            return {
                where: {
                      [Op.or]  : [
                        {
                            status: {
                              [Op.like]: `%${statusSearch}%`,
                            }
                          },
                      ]       
          },
        }
        }

        if(query.search && !query.status){
            return {
                where: {

                    [Op.or]: [
                        {
                          name: {
                            [Op.like]:`%${searchPattern}%`
                          }
                        },
                        {
                          role: {
                            [Op.like]: `%${searchPattern}%`,
                          }
                        },
                        {
                          email: {
                            [Op.like]: `%${searchPattern}%`,
                          }
                        }
                      ],
                      
          },
        }
        }

    if (query.search && query.status) {
    

        return {
                where: {

                    [Op.or]: [
                        {
                          name: {
                            [Op.like]:`%${searchPattern}%`
                          }
                        },
                        {
                          role: {
                            [Op.like]: `%${searchPattern}%`,
                          }
                        },
                        {
                          email: {
                            [Op.like]: `%${searchPattern}%`,
                          }
                        }
                      ],
                      [Op.and]  : [
                        {
                            status: {
                              [Op.like]: `%${statusSearch}%`,
                            }
                          },
                      ]       
          },
        }
        
    }
   
    return {};
}
