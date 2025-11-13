const cds = require('@sap/cds');

class MyOrderApprovalService extends cds.ApplicationService {
  async init() {
    await super.init();

    this.on('approveOrders', async (req) => {
      let { orders, approveLoad, reasonCode, filters } = req.data;

      // 🪵 Debug logs
      console.log("✅ Incoming approveOrders call");
      console.log("orders:", orders);
      console.log("approveLoad:", approveLoad);
      console.log("reasonCode:", reasonCode);
      console.log("filters (raw):", filters);

      // If filters provided (Approve All Filtered Orders)
      if (filters) {
        try {
          filters = JSON.parse(filters);
          console.log("filters (parsed):", filters);
        } catch (err) {
          console.error("❌ Error parsing filters:", err);
        }

        // Build WHERE conditions
        const whereConditions = {};
        if (filters.category) whereConditions.category = filters.category;
        if (filters.status) whereConditions.status = filters.status;
        if (filters.sourceLocation) whereConditions.sourceLocation = filters.sourceLocation;
        if (filters.destinationLocation) whereConditions.destinationLocation = filters.destinationLocation;
        if (filters.dateFrom && filters.dateTo) {
          whereConditions.orderDate = { ">=": filters.dateFrom, "<=": filters.dateTo };
        }

        console.log("whereConditions:", whereConditions);

        // Select matching order numbers from DB
        const rows = await SELECT.from('strbw.Orders')
          .where(whereConditions)
          .columns(['orderNumber']);

        orders = rows.map(r => r.orderNumber);
        console.log(`Found ${orders.length} matching orders from filters`);
      }

      if (!orders || orders.length === 0)
        return req.error(400, 'No orders to update.');

      // Update orders in DB
      if (reasonCode) {
        await UPDATE('strbw.Orders')
          .set({ approveLoad, reasonCode })
          .where({ orderNumber: { in: orders } });
      } else {
        await UPDATE('strbw.Orders')
          .set({ approveLoad })
          .where({ orderNumber: { in: orders } });
      }

      console.log(`✅ ${orders.length} orders updated successfully`);
      return { success: true, message: `${orders.length} orders updated successfully.` };
    });
  }
}

module.exports = MyOrderApprovalService;
