using MyOrderApprovalService as service from '../../srv/srv';

annotate service.Orders with @(
    UI.FieldGroup #GeneratedGroup: {
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
                Value: sourceLocation,
            },
            {
                $Type: 'UI.DataField',
                Value: destinationLocation,
            },
            {
                $Type: 'UI.DataField',
                Value: mot,
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
                Value: category,
            },
            {
                $Type: 'UI.DataField',
                Value: categoryDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: startDate,
            },
            {
                $Type: 'UI.DataField',
                Value: endDate,
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
                Value: mot2,
            },
            {
                $Type: 'UI.DataField',
                Value: abcClass,
            },
            {
                $Type: 'UI.DataField',
                Value: week,
            },
            {
                $Type: 'UI.DataField',
                Value: approveLoad,
            },
            {
                $Type: 'UI.DataField',
                Value: reasonCode,
            },
            {
                $Type : 'UI.DataField',
                Value : fastedMOT,
                Label : 'fastedMOT',
            },
            {
                $Type : 'UI.DataField',
                Value : fastedMotCost,
            },
            {
                $Type : 'UI.DataField',
                Value : fastedMotDurationDays,
            },
            {
                $Type : 'UI.DataField',
                Value : slowestMOT,
                Label : 'slowestMOT',
            },
            {
                $Type : 'UI.DataField',
                Value : slowestMotCost,
            },
            {
                $Type : 'UI.DataField',
                Value : slowestMotDurationDays,
            },
            {
                $Type : 'UI.DataField',
                Value : impactAmount,
            },
            {
                $Type : 'UI.DataField',
                Value : productCategory,
                Label : 'productCategory',
            },
            {
                $Type : 'UI.DataField',
                Value : estimatedRisk,
            },
            {
                $Type : 'UI.DataField',
                Value : costDelta,
            },
            {
                $Type : 'UI.DataField',
                Value : aiReason,
            },
            {
                $Type : 'UI.DataField',
                Value : aiOutput,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
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
    UI.selectionfields : [category, destinationlocation, mot, product, reasoncode, sourcelocation, ordernumber, approveload ],
    UI.SelectionFields : [
        approveLoad,
        category,
        mot,
        orderNumber,
        product,
        reasonCode,
        sourceLocation,
        destinationLocation,
    ],
    );

annotate service.Orders with {
    product @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'ProductVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: product,
                ValueListProperty: 'product',
            }, ],
            Label         : 'Product',
        },
        Common.ValueListWithFixedValues: false,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    mot @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'MOTVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: mot,
                ValueListProperty: 'mot',
            }, ],
            Label         : 'MOT',
        },
        Common.ValueListWithFixedValues: true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    sourceLocation @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'sourceLocationVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: sourceLocation,
                ValueListProperty: 'sourceLocation',
            }, ],
            Label         : 'Source Location ',
        },
        Common.ValueListWithFixedValues: true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    destinationLocation @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'destinationLocationVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: destinationLocation,
                ValueListProperty: 'destinationLocation',
            }, ],
            Label         : 'Destination Location',
        },
        Common.ValueListWithFixedValues: false,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    category @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'categoryVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: category,
                ValueListProperty: 'category',
            }, ],
            Label         : 'Category',
        },
        Common.ValueListWithFixedValues: true,
        Common.FieldControl : #ReadOnly,
    )
};

annotate service.Orders with {
    orderNumber @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Orders',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: orderNumber,
                ValueListProperty: 'orderNumber',
            }, ],
            Label         : 'OrderNo',
        },
        Common.ValueListWithFixedValues: false,
        Common.FieldControl            : #ReadOnly,
    )
};

annotate service.Orders with {
    reasonCode @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'reasonCodeVH',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: reasonCode,
                ValueListProperty: 'reasonCode',
            }, ],
            Label         : 'Reason Code',
        },
        Common.ValueListWithFixedValues: true,
    )
};

annotate service.Orders with @(
  UI.HeaderInfo: {
    TypeName: 'Order Details',
    TypeNamePlural: 'Orders',
    Title: { Value: orderNumber },
    Description: { Value: sourceLocation }
  }
);
annotate service.Orders with {
    itemNumber @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    uom @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    categoryDescription @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    startDate @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    endDate @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    destDaySupp @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    destStockOH @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    abcClass @Common.FieldControl : #ReadOnly
};

annotate service.Orders with {
    week @Common.FieldControl : #ReadOnly
};

