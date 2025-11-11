
const cds = require('@sap/cds');

class MyOrderApprovalService extends cds.ApplicationService {
  async init() {
    await super.init();

    //Handling Mass Upload using filters passed from UI-----halding filters
    this.on('approveOrders', async (req) => {
      let { orders, approveLoad, reasonCode, filters } = req.data;

      // If filters provided (Approve All Filtered Orders)
      if (filters) {
        filters = JSON.parse(filters); // parse JSON from UI

        // Build WHERE conditions based on business filter values
        const whereConditions = {};
        if (filters.category) whereConditions.category = filters.category;
        if (filters.status) whereConditions.status = filters.status;
        if (filters.sourceLocation) whereConditions.sourceLocation = filters.sourceLocation;
        if (filters.destinationLocation) whereConditions.destinationLocation = filters.destinationLocation;
        if (filters.dateFrom && filters.dateTo) {
          whereConditions.orderDate = { ">=": filters.dateFrom, "<=": filters.dateTo };
        }

        // Select matching order numbers from DB
        const rows = await SELECT.from('strbw.Orders')
          .where(whereConditions)
          .columns(['orderNumber']);

        orders = rows.map(r => r.orderNumber);
      }

      if (!orders || orders.length === 0) return req.error(400, 'No orders to update.');

      // Update orders in DB
      if(reasonCode){    
      await UPDATE('strbw.Orders')
        .set({ approveLoad, reasonCode })
        .where({ orderNumber: { in: orders } });
      }
      else {
        await UPDATE('strbw.Orders')
        .set({ approveLoad })
        .where({ orderNumber: { in: orders } });
      }

      return { success: true, message: `${orders.length} orders updated successfully.` };
    });
  }
}

module.exports = MyOrderApprovalService;