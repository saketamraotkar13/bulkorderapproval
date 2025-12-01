using {strbw as mydb} from '../db/data-model';

service MyOrderApprovalService {
    @odata.draft.bypass
    @odata.draft.enabled
    entity Orders                as projection on mydb.Orders;

    entity reasonCodeVH          as projection on mydb.reasonCodeVH;

    action   approveOrders(orders: array of {
        orderNumber : String;
        itemNumber  : String;
    },
                           approveLoad: Boolean,
                           reasonCode: String,
                           filters: String,
                           allSelected: Boolean) returns String;

    // Function to get approval statistics
    function getApprovalStats(filters : String)                  returns {
        totalOrders       : Integer;
        approvedOrders    : Integer;
        rejectedOrders    : Integer;
        pendingOrders     : Integer;
        approvalRate      : Decimal(5, 2);
        rejectionRate     : Decimal(5, 2);
        pendingRate       : Decimal(5, 2);
        sumOfQuantity     : Decimal(20, 3);
        sumOfProfitAtRisk : Decimal(20, 3);  // ✅ NEW
    };


    // Value helps
    entity ProductVH             as
        projection on mydb.Orders {
            key product : String
        }
        group by
            product;

    entity MOT2VH                as
        projection on mydb.mot2VH {
            key MOT2 : String
        }
        group by
            MOT2;

    entity MOTVH                 as
        projection on mydb.Orders {
            key mot : String
        }
        group by
            mot;

    entity sourceLocationVH      as
        projection on mydb.Orders {
            key sourceLocation : String
        }
        group by
            sourceLocation;

    entity destinationLocationVH as
        projection on mydb.Orders {
            key destinationLocation : String
        }
        group by
            destinationLocation;

    entity categoryVH            as
        projection on mydb.Orders {
            key category : String
        }
        group by
            category;

    entity OrdersVH              as
        projection on mydb.Orders {
            key orderNumber : String
        }
        group by
            orderNumber;

    entity productCategoryVH     as
        projection on mydb.Orders {
            key productCategory : String
        }
        group by
            productCategory;

    entity quantityVH            as
        projection on mydb.Orders {
            key quantity : Decimal(17,3)
        }
        group by
            quantity;

    entity uomVH                 as
        projection on mydb.Orders {
            key uom : String
        }
        group by
            uom;

    entity destDaySuppVH         as
        projection on mydb.Orders {
            key destDaySupp : Decimal(18,3)
        }
        group by
            destDaySupp;

    entity destStockOHVH         as
        projection on mydb.Orders {
            key destStockOH : Decimal(18,3)
        }
        group by
            destStockOH;

    entity abcClassVH            as
        projection on mydb.Orders {
            key abcClass : String
        }
        group by
            abcClass;

    @cds.persistence.skip
    entity BooleanVH {
        key code  : Boolean;
            label : String;
    };
}

// Capabilities
annotate MyOrderApprovalService.Orders with @(
    Capabilities.DeleteRestrictions: {Deletable: false},
    Capabilities.InsertRestrictions: {Insertable: false}
);