using MyOrderApprovalService as service from '../../srv/srv';

annotate service.Orders with @(
    UI.HeaderInfo: {
        TypeName: 'Order Details',
        TypeNamePlural: 'Orders',
        Title: { Value: orderNumber },
        Description: { Value: itemNumber }
    },
    
    Common.SemanticKey : [orderNumber, itemNumber],
    
    UI.Identification  : [
        {
            $Type : 'UI.DataField',
            Value : orderNumber
        },
        {
            $Type : 'UI.DataField',
            Value : itemNumber
        }
    ],
    
    UI.SelectionFields : [
        approveLoad,
        category,
        mot,
        orderNumber,
        product,
        reasonCode,
        sourceLocation,
        destinationLocation,
        abcClass,
        productCategory,
        mot2
    ],
    
    UI.LineItem : [
        {
            $Type: 'UI.DataField',
            Value: orderNumber,
        },
        {
            $Type: 'UI.DataField',
            Value: itemNumber,
        },
        {
            $Type : 'UI.DataField',
            Value : product,
        },
        {
            $Type : 'UI.DataField',
            Value : abcClass,
        },
        {
            $Type : 'UI.DataField',
            Value : category,
        },
        {
            $Type: 'UI.DataField',
            Value: sourceLocation,
        },
        {
            $Type: 'UI.DataField',
            Value: destinationLocation,
        },
        {
            $Type : 'UI.DataField',
            Value : destDaySupp,
        },
        {
            $Type : 'UI.DataField',
            Value : destStockOH,
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
        },
        {
            $Type : 'UI.DataField',
            Value : uom,
        },
        {
            $Type : 'UI.DataField',
            Value : mot,
        },
        {
            $Type : 'UI.DataField',
            Value : mot2,
        },
        {
            $Type : 'UI.DataField',
            Value : productCategory,
        },
        {
            $Type : 'UI.DataField',
            Value : estimatedRisk,
        },
        {
            $Type : 'UI.DataField',
            Value : aiReason,
        },
        {
            $Type: 'UI.DataField',
            Value: reasonCode,
        },
        {
            $Type: 'UI.DataField',
            Value: approveLoad,            
        },
    ],
    
    UI.Facets : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'OrderInformation',
            Label : 'Order Information',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'BasicInfo',
                    Label : 'Basic Details',
                    Target: '@UI.FieldGroup#BasicInfo',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'LocationInfo',
                    Label : 'Location Details',
                    Target: '@UI.FieldGroup#LocationInfo',
                },
            ]
        },
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'TransportationInfo',
            Label : 'Transportation Information',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'MOTInfo',
                    Label : 'Mode of Transport',
                    Target: '@UI.FieldGroup#MOTInfo',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'CostAnalysis',
                    Label : 'Cost Analysis',
                    Target: '@UI.FieldGroup#CostAnalysis',
                },
            ]
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'AIInsights',
            Label : 'AI Insights',
            Target: '@UI.FieldGroup#AIInsights',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'ApprovalInfo',
            Label : 'Approval Information',
            Target: '@UI.FieldGroup#ApprovalInfo',
        },
    ],
    
    UI.FieldGroup #BasicInfo: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: orderNumber,
            },
            {
                $Type: 'UI.DataField',
                Value: itemNumber,
            },
            {
                $Type: 'UI.DataField',
                Value: product,
            },
            {
                $Type: 'UI.DataField',
                Value: productCategory,
            },
            {
                $Type: 'UI.DataField',
                Value: category,
            },
            {
                $Type: 'UI.DataField',
                Value: categoryDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: abcClass,
            },
            {
                $Type: 'UI.DataField',
                Value: quantity,
            },
            {
                $Type: 'UI.DataField',
                Value: uom,
            },
            {
                $Type: 'UI.DataField',
                Value: week,
            },
        ],
    },
    
    UI.FieldGroup #LocationInfo: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: sourceLocation,
            },
            {
                $Type: 'UI.DataField',
                Value: destinationLocation,
            },
            {
                $Type: 'UI.DataField',
                Value: destDaySupp,
            },
            {
                $Type: 'UI.DataField',
                Value: destStockOH,
            },
            {
                $Type: 'UI.DataField',
                Value: startDate,
            },
            {
                $Type: 'UI.DataField',
                Value: endDate,
            },
        ],
    },
    
    UI.FieldGroup #MOTInfo: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: mot,
            },
            {
                $Type: 'UI.DataField',
                Value: mot2,
            },
            {
                $Type: 'UI.DataField',
                Value: fastestMOT,
                Label: 'Fastest MOT',
            },
            {
                $Type: 'UI.DataField',
                Value: fastestMOTDurationDays,
                Label: 'Fastest MOT Duration (Days)',
            },
            {
                $Type: 'UI.DataField',
                Value: slowestMOT,
                Label: 'Slowest MOT',
            },
            {
                $Type: 'UI.DataField',
                Value: slowestMOTDurationDays,
                Label: 'Slowest MOT Duration (Days)',
            },
        ],
    },
    
    UI.FieldGroup #CostAnalysis: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: fastestMOTCost,
                Label: 'Fastest MOT Cost',
            },
            {
                $Type: 'UI.DataField',
                Value: slowestMOTCost,
                Label: 'Slowest MOT Cost',
            },
            {
                $Type: 'UI.DataField',
                Value: costDelta,
                Label: 'Cost Delta',
            },
            {
                $Type: 'UI.DataField',
                Value: impactAmount,
                Label: 'Impact Amount',
            },
            {
                $Type: 'UI.DataField',
                Value: profitAtRisk,
                Label: 'Profit At Risk',
            },
        ],
    },
    
    UI.FieldGroup #AIInsights: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: estimatedRisk,
                Label: 'Estimated Risk',
            },
            {
                $Type: 'UI.DataField',
                Value: aiReason,
                Label: 'AI Reason',
            },
            {
                $Type: 'UI.DataField',
                Value: aiOutput,
                Label: 'AI Output',
            },
        ],
    },
    
    UI.FieldGroup #ApprovalInfo: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: approveLoad,
            },
            {
                $Type: 'UI.DataField',
                Value: reasonCode,
            },
        ],
    },
);

// ========================================
// Value Help Annotations
// ========================================

annotate service.Orders with {
    product @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ProductVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : product,
                    ValueListProperty : 'product',
                },
            ],
            Label : 'Product',
        },
        Common.ValueListWithFixedValues : false,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    productCategory @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'productCategoryVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : productCategory,
                    ValueListProperty : 'productCategory',
                },
            ],
            Label : 'Product Category',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    mot @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MOTVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : mot,
                    ValueListProperty : 'mot',
                },
            ],
            Label : 'Mode of Transport',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    mot2 @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MOT2VH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : mot2,
                    ValueListProperty : 'MOT2',
                },
            ],
            Label : 'MOT2',
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.Orders with {
    sourceLocation @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'sourceLocationVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : sourceLocation,
                    ValueListProperty : 'sourceLocation',
                },
            ],
            Label : 'Source Location',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    destinationLocation @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'destinationLocationVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : destinationLocation,
                    ValueListProperty : 'destinationLocation',
                },
            ],
            Label : 'Destination Location',
        },
        Common.ValueListWithFixedValues : false,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    category @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'categoryVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : category,
                    ValueListProperty : 'category',
                },
            ],
            Label : 'Category',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    orderNumber @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'OrdersVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : orderNumber,
                    ValueListProperty : 'orderNumber',
                },
            ],
            Label : 'Order Number',
        },
        Common.ValueListWithFixedValues : false,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    abcClass @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'abcClassVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : abcClass,
                    ValueListProperty : 'abcClass',
                },
            ],
            Label : 'ABC Class',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    reasonCode @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'reasonCodeVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : reasonCode,
                    ValueListProperty : 'reasonCode',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
            ],
            Label : 'Reason Code',
        },
        Common.ValueListWithFixedValues : true,
    )
};

annotate service.Orders with {
    approveLoad @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'BooleanVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : approveLoad,  
                    ValueListProperty : 'code',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'label',
                },
            ],
            Label : 'Approve Load',
        },
        Common.ValueListWithFixedValues : true,
    )
};

// ========================================
// Number Formatting for Decimal Fields
// ========================================

annotate service.Orders with {
    quantity @(
        Common.Label: 'Quantity',
        Measures.Unit: uom,
        UI.HiddenFilter: false
    );
    
    destDaySupp @(
        Common.Label: 'Destination Day Supply',
        UI.HiddenFilter: false
    );
    
    destStockOH @(
        Common.Label: 'Destination Stock On Hand',
        Measures.Unit: uom,
        UI.HiddenFilter: false
    );
    
    estimatedRisk @(
        Common.Label: 'Estimated Risk ($)',
        UI.HiddenFilter: false
    );
    
    profitAtRisk @(
        Common.Label: 'Profit At Risk ($)',
        UI.HiddenFilter: false
    );
    
    costDelta @(
        Common.Label: 'Cost Delta ($)',
        UI.HiddenFilter: false
    );
    
    impactAmount @(
        Common.Label: 'Impact Amount ($)',
        UI.HiddenFilter: false
    );
    
    fastestMOTCost @(
        Common.Label: 'Fastest MOT Cost ($)',
        UI.HiddenFilter: false
    );
    
    slowestMOTCost @(
        Common.Label: 'Slowest MOT Cost ($)',
        UI.HiddenFilter: false
    );
};

// ========================================
// Field Control (Read-Only Fields)
// ========================================

annotate service.Orders with {
    itemNumber                @Common.FieldControl : #ReadOnly;
    quantity                  @Common.FieldControl : #ReadOnly;
    uom                       @Common.FieldControl : #ReadOnly;
    categoryDescription       @Common.FieldControl : #ReadOnly;
    startDate                 @Common.FieldControl : #ReadOnly;
    endDate                   @Common.FieldControl : #ReadOnly;
    destDaySupp               @Common.FieldControl : #ReadOnly;
    destStockOH               @Common.FieldControl : #ReadOnly;
    week                      @Common.FieldControl : #ReadOnly;
    fastestMOT                @Common.FieldControl : #ReadOnly;
    fastestMOTCost            @Common.FieldControl : #ReadOnly;
    fastestMOTDurationDays    @Common.FieldControl : #ReadOnly;
    slowestMOT                @Common.FieldControl : #ReadOnly;
    slowestMOTCost            @Common.FieldControl : #ReadOnly;
    slowestMOTDurationDays    @Common.FieldControl : #ReadOnly;
    impactAmount              @Common.FieldControl : #ReadOnly;
    productCategory           @Common.FieldControl : #ReadOnly;
    estimatedRisk             @Common.FieldControl : #ReadOnly;
    costDelta                 @Common.FieldControl : #ReadOnly;
    aiReason                  @Common.FieldControl : #ReadOnly;
    aiOutput                  @Common.FieldControl : #ReadOnly;
    profitAtRisk              @Common.FieldControl : #ReadOnly;
};

// ========================================
// Value Help Entity Annotations
// ========================================

annotate service.reasonCodeVH with {
    reasonCode  @title : 'Reason Code';
    description @title : 'Description';
};

annotate service.MOT2VH with {
    MOT2 @title : 'MOT2';
};

annotate service.BooleanVH with {
    code  @title : 'Code';
    label @title : 'Label';
};