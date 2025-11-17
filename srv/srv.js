const cds = require('@sap/cds');

class MyOrderApprovalService extends cds.ApplicationService {

    async init() {
        await super.init();

        this.on('approveOrders', async (req) => {

            let { orders, approveLoad, reasonCode, filters, allSelected } = req.data;

            console.log("🔥 approveOrders invoked");
            console.log("orders:", orders);
            console.log("filters (raw):", filters);
            console.log("allSelected:", allSelected);

            const validFields = [
                'orderNumber','itemNumber','product','sourceLocation','destinationLocation',
                'mot','quantity','uom','category','categoryDescription','startDate','endDate',
                'destDaySupp','destStockOH','mot2','abcClass','week','approveLoad','reasonCode'
            ];

            let whereConditions = {};

            // -------------------------------
            //  PARSE FILTERS
            // -------------------------------
            if (filters) {
                let aFilters = [];
                try {
                    aFilters = JSON.parse(filters);
                } catch (e) { console.log("❌ Filter parse error:", e); }

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

            // -------------------------------
            //  DETERMINE WHICH ORDERS TO UPDATE
            // -------------------------------
            let ordersToUpdate = [];

            if (allSelected) {
                console.log("🔍 allSelected = TRUE — loading by filters");

                const rows = await SELECT.from('strbw.Orders')
                    .where(whereConditions)
                    .columns(['orderNumber', 'itemNumber']);

                ordersToUpdate = rows.map(r => ({ 
                    orderNumber: r.orderNumber, 
                    itemNumber: r.itemNumber 
                }));
            }
            else {
                console.log("🔍 Updating only selected orders");

                if (!orders || orders.length === 0) {
                    return req.error(400, "No orders selected.");
                }

                if (Object.keys(whereConditions).length > 0) {
                    const rows = await SELECT.from('strbw.Orders')
                        .where(whereConditions)
                        .columns(['orderNumber', 'itemNumber']);

                    ordersToUpdate = orders.filter(o => 
                        rows.some(r => 
                            r.orderNumber === o.orderNumber && 
                            r.itemNumber === o.itemNumber
                        )
                    );
                } else {
                    ordersToUpdate = orders;
                }
            }

            if (ordersToUpdate.length === 0) {
                return req.error(400, "No orders to update.");
            }

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
                    
                    if (reasonCode) {
                        return {
                            sql: `UPDATE strbw_Orders SET approveLoad = ?, reasonCode = ? WHERE ${conditions}`,
                            params: [approveLoad, reasonCode, ...params]
                        };
                    } else {
                        return {
                            sql: `UPDATE strbw_Orders SET approveLoad = ? WHERE ${conditions}`,
                            params: [approveLoad, ...params]
                        };
                    }
                };

                // Decide strategy based on volume
                if (ordersToUpdate.length <= 5000) {
                    // Single query for small to medium datasets
                    const query = buildUpdateQuery(ordersToUpdate);
                    await db.run(query.sql, query.params);
                    
                    console.log(`✅ Updated ${ordersToUpdate.length} orders in 1 query`);
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
                    
                    console.log(`✅ Updated ${ordersToUpdate.length} orders in ${batches.length} parallel queries`);
                }

                return {
                    success: true,
                    message: `${ordersToUpdate.length} orders updated successfully.`
                };

            } catch (err) {
                console.error("❌ Bulk update error:", err);
                return req.error(500, "Bulk approval failed: " + err.message);
            }

        });
    }
}

module.exports = MyOrderApprovalService;