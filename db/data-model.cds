namespace strbw;

entity Orders {
    @title: 'Order Number'
    key orderNumber           : String;
    @title: 'Item Number'
    key itemNumber                : String;
    @title: 'Product'
    product                   : String;
    @title: 'Source Location'
    sourceLocation            : String;
    @title: 'Destination Location'
    destinationLocation       : String;
    @title: 'Mode of Transport'
    mot                       : String;
    @title: 'Quantity'
    quantity                  : Decimal(17,3);
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
    destDaySupp               : Decimal(18,3);
    @title: 'Destination Stock On Hand'
    destStockOH               : Decimal(18,3);
    @title: 'Suggested MOT'
    mot2                      : String;
    @title: 'AI Recommended MOT'
    aimot2                    : String;    
    @title: 'ABC Class'
    abcClass                  : String;
    @title: 'Week'
    week                      : String;
    @title: 'Approve Load'
    approveLoad               : Boolean;
    @title: 'Reason Code'
    reasonCode                : String;
//new fields    
    @title: 'Fastest MOT'
    fastestMOT               : String;
    @title: 'Slowest MOT'
    slowestMOT                : String;
    @title: 'Product Category'
    productCategory          : String;
    @title : 'Estimated Risk'
    estimatedRisk            : Decimal(15,2);
    @title : 'Profit At Risk'
    profitAtRisk            : Decimal(17,3);
    @title : 'Cost Delta'
    costDelta                : Decimal(17,3);
    @title : 'Impact Amount'
    impactAmount            : Decimal(17,3);
    @title: 'Fasted MOT Cost'
    fastestMOTCost           : Decimal(17,3);
    @title : 'Slowest MOT Cost'
    slowestMOTCost          : Decimal(17,3);
    @title: 'Fastest MOT Duration Days'
    fastestMOTDurationDays       : String;
    @title: 'Slowest MOT Duration Days'
    slowestMOTDurationDays      : String;
    @title : 'AI Reason'
    aiReason                    : String;
} 

entity reasonCodeVH  {
    key reasonCode: String;
    description: String;
}

entity mot2VH  {
    key MOT2: String;
}