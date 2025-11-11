namespace strbw;

entity Orders {
    @title: 'Order Number'
    key orderNumber           : String;
    @title: 'Item Number'
    itemNumber                : String;
    @title: 'Product'
    product                   : String;
    @title: 'Source Location'
    sourceLocation            : String;
    @title: 'Destination Location'
    destinationLocation       : String;
    @title: 'Mode of Transport'
    mot                       : String;
    @title: 'Quantity'
    quantity                  : Decimal;
    @title: 'Unit of Measure'
    uom                       : String;
    @title: 'Category'
    category                  : String;
    @title: 'Category Description'
    categoryDescription       : String;
    @title: 'Start Date'
    startDate                 : String;
    @title: 'End Date'
    endDate                   : String;
    @title: 'Destination Day Supply'
    destDaySupp               : Integer;
    @title: 'Destination Stock On Hand'
    destStockOH               : Decimal;
    @title: 'MOT2'
    mot2                      : String;
    @title: 'ABC Class'
    abcClass                  : String;
    @title: 'Week'
    week                      : String;
    @title: 'Approve Load'
    approveLoad               : Boolean;
    @title: 'Reason Code'
    reasonCode                : String;
}

entity reasonCodeVH  {
    key reasonCode: String;
    description: String;
}