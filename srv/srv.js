const cds = require('@sap/cds');

class MyOrderApprovalService extends cds.ApplicationService {
    async init() {
        await super.init();

        this.on('approveOrders', async (req) => {
            let { orders, approveLoad, reasonCode, filters, allSelected } = req.data;

            console.log("✅ Incoming approveOrders call");
            console.log("orders:", orders);
            console.log("approveLoad:", approveLoad);
            console.log("reasonCode:", reasonCode);
            console.log("allSelected:", allSelected);
            console.log("filters (raw):", filters);

            const validFields = [
                'orderNumber','itemNumber','product','sourceLocation','destinationLocation',
                'mot','quantity','uom','category','categoryDescription','startDate','endDate',
                'destDaySupp','destStockOH','mot2','abcClass','week','approveLoad','reasonCode'
            ];

            let whereConditions = {};

            // 🔹 Process filters if provided
            if (filters) {
                let aFilters = [];
                try {
                    aFilters = JSON.parse(filters);
                } catch (err) {
                    console.error("❌ Error parsing filters:", err);
                }

                const validFilters = aFilters.filter(f => f.path && validFields.includes(f.path));

                validFilters.forEach(f => {
                    if (!f.path) return;

                    switch(f.operator) {
                        case "EQ":
                            if (whereConditions[f.path]) {
                                if (!Array.isArray(whereConditions[f.path].in)) {
                                    whereConditions[f.path] = { in: [whereConditions[f.path]] };
                                }
                                if (Array.isArray(f.value1)) {
                                    whereConditions[f.path].in.push(...f.value1);
                                } else {
                                    whereConditions[f.path].in.push(f.value1);
                                }
                            } else {
                                if (Array.isArray(f.value1)) {
                                    whereConditions[f.path] = { in: f.value1 };
                                } else {
                                    whereConditions[f.path] = f.value1;
                                }
                            }
                            break;
                        case "NE":
                            whereConditions[f.path] = { "<>": f.value1 };
                            break;
                        case "GT":
                            whereConditions[f.path] = { ">": f.value1 };
                            break;
                        case "LT":
                            whereConditions[f.path] = { "<": f.value1 };
                            break;
                        case "GE":
                            whereConditions[f.path] = { ">=": f.value1 };
                            break;
                        case "LE":
                            whereConditions[f.path] = { "<=": f.value1 };
                            break;
                        case "BT":
                            if (f.value2 !== undefined) {
                                whereConditions[f.path] = { ">=": f.value1, "<=": f.value2 };
                            }
                            break;
                        default:
                            console.warn("Unsupported filter operator:", f.operator);
                    }
                });
            }

            let ordersToUpdate = [];

            if (allSelected) {
                // 🔹 Apply to all filtered orders (or all if filters empty)
                const rows = await SELECT.from('strbw.Orders')
                    .where(whereConditions)
                    .columns(['orderNumber']);

                ordersToUpdate = rows.map(r => r.orderNumber);

            } else {
                // 🔹 Only update selected orders
                if (!orders || orders.length === 0) {
                    return req.error(400, "No orders selected.");
                }

                if (Object.keys(whereConditions).length > 0) {
                    const rows = await SELECT.from('strbw.Orders')
                        .where(whereConditions)
                        .columns(['orderNumber']);
                    const filteredOrders = rows.map(r => r.orderNumber);
                    ordersToUpdate = orders.filter(o => filteredOrders.includes(o));
                } else {
                    ordersToUpdate = orders;
                }
            }

            if (!ordersToUpdate || ordersToUpdate.length === 0) {
                return req.error(400, 'No orders to update.');
            }

            // Prepare update payload
            const updateData = reasonCode ? { approveLoad, reasonCode } : { approveLoad };

            await UPDATE('strbw.Orders')
                .set(updateData)
                .where({ orderNumber: { in: ordersToUpdate } });

            console.log(`✅ ${ordersToUpdate.length} orders updated successfully`);
            return { success: true, message: `${ordersToUpdate.length} orders updated successfully.` };
        });
    }
}

module.exports = MyOrderApprovalService;
