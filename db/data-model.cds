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
//new fields    
    @title: 'Fastest MOT'
    fastestMOT               : String;
    @title: 'Slowest MOT'
    slowestMOT                : String;
    @title: 'Product Category'
    productCategory          : String;
    @title : 'Estimated Risk'
    estimatedRisk            : String;
    @title : 'Profit At Risk'
    profitAtRisk            : String;
    @title : 'Cost Delta'
    costDelta                : String;
    @title : 'Impact Amount'
    impactAmount            : String;
    @title: 'Fasted MOT Cost'
    fastestMOTCost           : String;
    @title : 'Slowest MOT Cost'
    slowestMOTCost          : String;
    @title: 'Fastest MOT Duration Days'
    fastestMOTDurationDays       : String;
    @title: 'Slowest MOT Duration Days'
    slowestMOTDurationDays      : String;
    @title : 'AI Reason'
    aiReason                    : String;
    @title: 'AI Output'
    aiOutput                    : String;
} 

entity reasonCodeVH  {
    key reasonCode: String;
    description: String;
}

entity mot2VH  {
    key MOT2: String;
}