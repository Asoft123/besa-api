import StatusCodes from "@mopos/constants/enums/StatusCodes";
import ErrorResponse from "@mopos/constants/ErrorResponse";
import { AdminUser } from "@mopos/models/AdminUser";
import { Office } from "@mopos/models/Office";

import { Sequelize } from "sequelize";

class OfficeServices {
  public async offices() {
    return await Office.findAll({order: [['created_at', 'DESC']]});
  }


  public async activeOffices(){
    return await Office.findAll({where:{is_active:true},
      order: [['created_at', 'DESC']]});
  }

  public async office(officeId:string) {
    const office = await Office.findOne({
      where:{id:officeId},
      include:[{model:AdminUser,attributes:{ exclude: [ 'password', 'last_login'] }}]
  });

    if (!office) {
        throw new ErrorResponse("No office address was found", StatusCodes.BAD_REQUEST);
    }
    return office;
  }

  public async createOffice(
    user: AdminUser,
    name: string,
    state: string,
    lga: string,
    city: string,
    address: string,
    contact1: string,
    contact2: string,
  ) {
    const isExist = await Office.findOne({
      where: { name: name, lga: lga },
    });
    if (isExist) {
      throw new ErrorResponse("Office already exists", StatusCodes.BAD_REQUEST);
    }

    await Office.create({
      name,
      state,
      lga,
      city,
      address,
      contact1,
      contact2,
      added_by_id: user.id,
    });
  }

  public async updateOffice(user: AdminUser, officeId:string,  data: { [key: string]: any }) {
    const values: { [key: string]: any } = {};
    
    const office = await Office.findByPk(officeId, {attributes:{ exclude: [ 'added_by_id'] }});
    if (!office) {
        throw new ErrorResponse("No office address found", StatusCodes.BAD_REQUEST);
    }

    if(data.name){
      values.name = data.name
    }
    if(data.state){
      values.state = data.state
    }
    if(data.lga){
      values.lga = data.lga
    }
    if(data.city){
      values.city = data.city
    }
    if(data.address){
      values.address = data.address
    }
    if(data.is_active || !data.is_active){
      values.is_active = data.is_active
    }
    await office.update(values);

    return office;
  }

  public async deleteOffice(user: AdminUser, officeId:string){
    const office = await Office.findByPk(officeId, {attributes:{ exclude: [ 'added_by_id'] }});
    if (!office) {
        throw new ErrorResponse("No office address found", StatusCodes.NOT_FOUND);
    }


   const deletedOffice =  await Office.destroy({where: {
      id: officeId
    }})

    if(!deletedOffice){
      throw new ErrorResponse("An unexpected error occured while deleting office", StatusCodes.BAD_REQUEST);
    }
 return deletedOffice;
  }
}

export default OfficeServices;
