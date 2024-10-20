export type AddNewLoanType =  {
    amount_figure:Number;
    amount_word:String;
    customer:String;
    purpose:String;
    endDate:Date;
    startDate:Date;
    interestRate:Number;
    termMonths:Number;
}

export type ApproveLoanType = {
    status:String;
}