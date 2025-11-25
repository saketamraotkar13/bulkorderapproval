const cds = require('@sap/cds');

class MyOrderApprovalService extends cds.ApplicationService {

    async init() {        
        const { BooleanVH, Orders } = this.entities;

        // -------------------------------
        //  Validation: Approval & Reason Code Logic
        // -------------------------------
        this.before(['UPDATE'], 'Orders', async (req) => {
            const { approveLoad, reasonCode, mot2 } = req.data;
            
            console.log(`Validation triggered: approveLoad=${approveLoad}, reasonCode=${reasonCode}`);

            if (mot2 && approveLoad === null)
            {
                return req.error(400, 'Please Approve the Order in order to update User Suggested MOT');
            }
            
            // Rule 1: If approving (true), reasonCode must be cleared
            if (approveLoad === true && reasonCode) {
                req.data.reasonCode = null; // Clear it automatically
                console.log("✅ Order approved: reasonCode cleared");
            }
            
            // Rule 2: If rejecting (false), reasonCode is mandatory
            if (approveLoad === false && (!reasonCode || reasonCode.trim() === '')) {
                return req.error(400, 'Reason Code is required when rejecting an order (approveLoad = false).');
            }
            
            // Rule 3: If pending (null/undefined), reasonCode should be empty
            if (approveLoad === null || approveLoad === undefined) {
                req.data.reasonCode = null;
                console.log("⏳ Order pending: reasonCode cleared");
            }
        });


        // -------------------------------
        //  getApprovalStats function
        // -------------------------------
        this.on('getApprovalStats', async (req) => {
            console.log("getApprovalStats invoked");

            try {
                const result = await SELECT.one.from(Orders).columns(
                    'count(*) as totalOrders',
                    `sum(case when approveLoad = true  then 1 else 0 end) as approvedOrders`,
                    `sum(case when approveLoad = false then 1 else 0 end) as rejectedOrders`,
                    `sum(case when approveLoad is null then 1 else 0 end) as pendingOrders`,
                    'sum(quantity) as sumOfQuantity',
                    'sum(profitAtRisk) as sumOfProfitAtRisk' 
                );

                // Calculate percentages
                const total = result.totalOrders || 0;
                const approved = result.approvedOrders || 0;
                const rejected = result.rejectedOrders || 0;
                const pending = result.pendingOrders || 0;

                const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(2) : 0;
                const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(2) : 0;
                const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(2) : 0;

                return {
                    totalOrders: total,
                    approvedOrders: approved,
                    rejectedOrders: rejected,
                    pendingOrders: pending,
                    approvalRate: parseFloat(approvalRate),
                    rejectionRate: parseFloat(rejectionRate),
                    pendingRate: parseFloat(pendingRate),
                    sumOfQuantity: parseFloat(Number(result.sumOfQuantity || 0).toFixed(3)),
                    sumOfProfitAtRisk: parseFloat(Number(result.sumOfProfitAtRisk || 0).toFixed(3))
                };

            } catch (err) {
                console.error("❌ Error fetching approval stats:", err);
                return req.error(500, "Failed to fetch approval statistics: " + err.message);
            }
        });

        // -------------------------------
        //  Boolean Values f4 help
        // -------------------------------
        this.on('READ', 'BooleanVH', async (req) => {
            console.log("📖 BooleanVH READ triggered!");
            const data = [
                { code: true,  label: "true" },
                { code: false, label: "false" }
            ];
            return data;
        });

        // -------------------------------
        //  approveOrders action
        // -------------------------------
        this.on('approveOrders', async (req) => {

            let { orders, approveLoad, reasonCode, filters, allSelected } = req.data;

            console.log("🔥 approveOrders invoked");
            console.log("orders:", orders);
            console.log("filters (raw):", filters);
            console.log("allSelected:", allSelected);

            // ✅ Complete field list including new fields
            const validFields = [
                'orderNumber', 'itemNumber', 'product', 'sourceLocation', 'destinationLocation',
                'mot', 'quantity', 'uom', 'category', 'categoryDescription', 'startDate', 'endDate',
                'destDaySupp', 'destStockOH', 'mot2', 'abcClass', 'week', 'approveLoad', 'reasonCode',
                // New fields
                'fastestMOT', 'slowestMOT', 'productCategory', 'estimatedRisk', 'profitAtRisk',
                'costDelta', 'impactAmount', 'fastestMOTCost', 'slowestMOTCost', 
                'fastestMOTDurationDays', 'slowestMOTDurationDays', 'aiReason', 'aiOutput'
            ];

            let whereConditions = {};

            // -------------------------------
            //  PARSE FILTERS
            // -------------------------------
            if (filters) {
                let aFilters = [];
                try {
                    aFilters = JSON.parse(filters);
                } catch (e) { 
                    console.log("❌ Filter parse error:", e);
                    return req.error(400, "Invalid filter format");
                }

                const validFilters = aFilters.filter(f => f.path && validFields.includes(f.path));

                validFilters.forEach(f => {
                    const field = f.path;

                    switch (f.operator) {
                        case "EQ":
                            if (!whereConditions[field]) {
                                whereConditions[field] = [];
                            }
                            whereConditions[field].push(f.value1);
                            break;

                        case "BT":
                            whereConditions[field] = { ">=": f.value1, "<=": f.value2 };
                            break;

                        case "NE":
                            whereConditions[field] = { "<>": f.value1 };
                            break;

                        case "GT":
                            whereConditions[field] = { ">": f.value1 };
                            break;

                        case "LT":
                            whereConditions[field] = { "<": f.value1 };
                            break;

                        case "GE":
                            whereConditions[field] = { ">=": f.value1 };
                            break;

                        case "LE":
                            whereConditions[field] = { "<=": f.value1 };
                            break;

                        case "Contains":
                        case "CP":
                            whereConditions[field] = { like: `%${f.value1}%` };
                            break;

                        case "StartsWith":
                            whereConditions[field] = { like: `${f.value1}%` };
                            break;

                        case "EndsWith":
                            whereConditions[field] = { like: `%${f.value1}` };
                            break;

                        default:
                            console.warn("⚠ Unsupported operator:", f.operator);
                    }
                });

                // Convert EQ arrays → IN conditions
                Object.keys(whereConditions).forEach(k => {
                    if (Array.isArray(whereConditions[k])) {
                        whereConditions[k] = { in: whereConditions[k] };
                    }
                });
            }

            console.log("🔍 Where conditions:", JSON.stringify(whereConditions, null, 2));

            // -------------------------------
            //  DETERMINE WHICH ORDERS TO UPDATE
            // -------------------------------
            let ordersToUpdate = [];

            if (allSelected) {
                console.log("🔍 allSelected = TRUE — loading by filters");

                try {
                    const rows = await SELECT.from(Orders)
                        .where(whereConditions)
                        .columns(['orderNumber', 'itemNumber']);

                    ordersToUpdate = rows.map(r => ({
                        orderNumber: r.orderNumber,
                        itemNumber: r.itemNumber
                    }));

                    console.log(`📊 Found ${ordersToUpdate.length} orders matching filters`);
                } catch (err) {
                    console.error("❌ Error fetching orders:", err);
                    return req.error(500, "Failed to fetch orders: " + err.message);
                }
            }
            else {
                console.log("🔍 Updating only selected orders");

                if (!orders || orders.length === 0) {
                    return req.error(400, "No orders selected.");
                }

                if (Object.keys(whereConditions).length > 0) {
                    try {
                        const rows = await SELECT.from(Orders)
                            .where(whereConditions)
                            .columns(['orderNumber', 'itemNumber']);

                        ordersToUpdate = orders.filter(o =>
                            rows.some(r =>
                                r.orderNumber === o.orderNumber &&
                                r.itemNumber === o.itemNumber
                            )
                        );
                    } catch (err) {
                        console.error("❌ Error validating selected orders:", err);
                        return req.error(500, "Failed to validate orders: " + err.message);
                    }
                } else {
                    ordersToUpdate = orders;
                }
            }

            if (ordersToUpdate.length === 0) {
                return req.error(400, "No orders to update after applying filters.");
            }

            console.log(`✅ Will update ${ordersToUpdate.length} orders`);

            // -------------------------------
            //  OPTIMIZED UPDATE WITH NATIVE SQL
            // -------------------------------
            try {
                const db = await cds.connect.to('db');

                // ✅ Build parameterized SQL query
                const buildUpdateQuery = (batch) => {
                    const conditions = batch.map((_, idx) =>
                        `(orderNumber = ? AND itemNumber = ?)`
                    ).join(' OR ');

                    const params = batch.flatMap(order => [order.orderNumber, order.itemNumber]);

                    // if (reasonCode) {
                        return {
                            sql: `UPDATE strbw_Orders SET approveLoad = ?, reasonCode = ? WHERE ${conditions}`,
                            params: [approveLoad, reasonCode, ...params]
                        };
                    // } else {
                    //     return {
                    //         sql: `UPDATE strbw_Orders SET approveLoad = ? WHERE ${conditions}`,
                    //         params: [approveLoad, ...params]
                    //     };
                    // }
                };

                const startTime = Date.now();

                // Decide strategy based on volume
                if (ordersToUpdate.length <= 5000) {
                    // Single query for small to medium datasets
                    const query = buildUpdateQuery(ordersToUpdate);
                    await db.run(query.sql, query.params);

                    const duration = Date.now() - startTime;
                    console.log(`✅ Updated ${ordersToUpdate.length} orders in 1 query (${duration}ms)`);
                } else {
                    // Parallel batch execution for large datasets
                    const BATCH_SIZE = 1000;
                    const chunk = (arr, size) =>
                        arr.reduce((acc, _, i) =>
                            (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

                    const batches = chunk(ordersToUpdate, BATCH_SIZE);

                    await Promise.all(
                        batches.map(batch => {
                            const query = buildUpdateQuery(batch);
                            return db.run(query.sql, query.params);
                        })
                    );

                    const duration = Date.now() - startTime;
                    console.log(`✅ Updated ${ordersToUpdate.length} orders in ${batches.length} parallel queries (${duration}ms)`);
                }

                return {
                    success: true,
                    message: `Successfully updated ${ordersToUpdate.length} order${ordersToUpdate.length > 1 ? 's' : ''}.`,
                    count: ordersToUpdate.length
                };

            } catch (err) {
                console.error("❌ Bulk update error:", err);
                return req.error(500, "Bulk approval failed: " + err.message);
            }

        });

        await super.init();
    }
}

module.exports = MyOrderApprovalService;