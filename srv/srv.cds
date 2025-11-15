using {strbw as mydb} from '../db/data-model';

service MyOrderApprovalService {

    @odata.draft.bypass
    @odata.draft.enabled
    entity Orders                as projection on mydb.Orders;

    entity reasonCodeVH          as projection on mydb.reasonCodeVH;

    action approveOrders(orders: array of String,
                         approveLoad: Boolean,
                         reasonCode: String,
                         filters: String,
                         allSelected: Boolean) returns String;

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

}


annotate MyOrderApprovalService.Orders with @Capabilities.DeleteRestrictions: {Deletable: false};
annotate MyOrderApprovalService.Orders with @Capabilities.InsertRestrictions: {Insertable: false};
