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
                    .columns(['orderNumber']);

                ordersToUpdate = rows.map(r => r.orderNumber);
            }
            else {
                console.log("🔍 Updating only selected orders");

                if (!orders || orders.length === 0) {
                    return req.error(400, "No orders selected.");
                }

                if (Object.keys(whereConditions).length > 0) {
                    const rows = await SELECT.from('strbw.Orders')
                        .where(whereConditions)
                        .columns(['orderNumber']);

                    const filtered = rows.map(r => r.orderNumber);

                    ordersToUpdate = orders.filter(o => filtered.includes(o));
                } else {
                    ordersToUpdate = orders;
                }
            }

            if (ordersToUpdate.length === 0) {
                return req.error(400, "No orders to update.");
            }

            // -------------------------------
            //  BATCH UPDATE (Fixes packet errors)
            // -------------------------------
            const BATCH_SIZE = 200;

            const chunk = (arr, size) =>
                arr.reduce((acc, _, i) =>
                    (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

            const batches = chunk(ordersToUpdate, BATCH_SIZE);

            const updateData = reasonCode
                ? { approveLoad, reasonCode }
                : { approveLoad };

            try {
                for (const batch of batches) {
                    await UPDATE('strbw.Orders')
                        .set(updateData)
                        .where({ orderNumber: { in: batch } });
                }

                console.log(`✅ Updated ${ordersToUpdate.length} orders in ${batches.length} batches`);

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
