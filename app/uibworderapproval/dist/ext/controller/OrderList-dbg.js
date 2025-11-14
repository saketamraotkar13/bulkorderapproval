sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';
    
    return {

        onBulkApproval: async function (oContext, aSelectedContexts) {
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                sap.m.MessageBox.warning("Please select at least one order.");
                return;
            }

            const oModel = aSelectedContexts[0].getModel();
            const aSelectedOrders = aSelectedContexts.map(ctx => ctx.getObject());
            const aOrders = aSelectedOrders.map(o => o.orderNumber);
            const countSelectedOrders = aSelectedOrders.length;

            // 🔹 Flatten FE filters
            const flattenFilters = function(oFilter) {
                let aResult = [];
                if (!oFilter) return aResult;
                if (oFilter.aFilters && oFilter.aFilters.length > 0) {
                    oFilter.aFilters.forEach(f => {
                        aResult = aResult.concat(flattenFilters(f));
                    });
                } else if (oFilter.sPath) {
                    aResult.push({
                        path: oFilter.sPath,
                        operator: oFilter.sOperator,
                        value1: oFilter.oValue1,
                        value2: oFilter.oValue2
                    });
                }
                return aResult;
            };

            const oFEFilters = this.getFilters();
            let aFilters = [];
            if (oFEFilters.filters && oFEFilters.filters.length > 0) {
                aFilters = flattenFilters(oFEFilters.filters[0]);
            }

            // ✅ Controls
            var oApproveCheckbox = new sap.m.CheckBox({
                text: "Approve Load",
                width: "100%",
                selected: true
            });

            var oReasonCombo = new sap.m.ComboBox({
                width: "100%",
                placeholder: "Select Reason Code...",
                enabled: !oApproveCheckbox.getSelected(),
                required: !oApproveCheckbox.getSelected(),
                items: {
                    path: "/reasonCodeVH",
                    template: new sap.ui.core.ListItem({
                        key: "{reasonCode}",
                        text: "{reasonCode} - {description}"
                    })
                }
            });

            oApproveCheckbox.attachSelect(function(oEvent){
                var bApprove = oEvent.getParameter("selected");
                oReasonCombo.setEnabled(!bApprove);
                oReasonCombo.setRequired(!bApprove);
            });

            var oSelectAllCheckbox = new sap.m.CheckBox({
                text: "Apply on all filtered orders",
                design: "Bold",
                width: "90%",
                selected: false
            });

            var oCountOrders = new sap.m.Label({
                text: "Selected Orders: " + countSelectedOrders,
                width: "100%",
                visible: !oSelectAllCheckbox.getSelected()
            });

            // toggle visibility of selected count
            oSelectAllCheckbox.attachSelect(function(oEvent) {
                oCountOrders.setVisible(!oEvent.getParameter("selected"));
            });

            // VBox layout
            var oVBox = new sap.m.VBox({
                width: "100%",
                items: [
                    oApproveCheckbox,
                    new sap.m.Label({ text: "Reason Code", design: "Bold" }),
                    oReasonCombo,
                    oCountOrders,
                    oSelectAllCheckbox
                ],
                class: "sapUiSmallMargin sapUiMediumPadding"
            });

            // Dialog
            var oDialog = new sap.m.Dialog({
                title: "Bulk Approval",
                contentWidth: "400px",
                type: "Message",
                content: [oVBox],
                beginButton: new sap.m.Button({
                    text: "Confirm",
                    type: "Emphasized",
                    press: async function () {
                        var bApproveLoad = oApproveCheckbox.getSelected();
                        var sReasonCode = oReasonCombo.getSelectedKey();
                        var bSelectAll = oSelectAllCheckbox.getSelected();

                        if (!bApproveLoad && !sReasonCode) {
                            sap.m.MessageBox.warning("Reason Code is required when rejecting the order.");
                            return;
                        }

                        try {
                            // Split orders into chunks
                            function chunkArray(array, size) {
                                const result = [];
                                for (let i = 0; i < array.length; i += size) {
                                    result.push(array.slice(i, i + size));
                                }
                                return result;
                            }

                            const chunkedOrders = chunkArray(aOrders, 200);

                            for (const ordersChunk of chunkedOrders) {
                                var oAction = oModel.bindContext("/approveOrders(...)");
                                oAction.setParameter("orders", ordersChunk);
                                oAction.setParameter("approveLoad", bApproveLoad);
                                oAction.setParameter("reasonCode", sReasonCode);
                                oAction.setParameter("filters", JSON.stringify(aFilters));
                                oAction.setParameter("allSelected", bSelectAll);

                                await oAction.execute();
                            }

                            sap.m.MessageToast.show("Orders processed successfully.");
                            oModel.refresh();
                        } catch (oError) {
                            console.error("Bulk approval failed:", oError);
                            sap.m.MessageBox.error("Bulk approval failed: " + (oError.message || "Unknown error"));
                        } finally {
                            oDialog.close();
                        }
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.setModel(oModel);
            oDialog.addStyleClass("sapUiContentPadding sapUiSizeCompact");
            oDialog.open();
        },

        _flattenFilters: function(oFilter) {
            let aResult = [];
            if (!oFilter) return aResult;
            if (oFilter.aFilters && oFilter.aFilters.length > 0) {
                oFilter.aFilters.forEach(f => {
                    aResult = aResult.concat(this._flattenFilters(f));
                });
            } else if (oFilter.sPath) {
                aResult.push({
                    path: oFilter.sPath,
                    operator: oFilter.sOperator,
                    value1: oFilter.oValue1,
                    value2: oFilter.oValue2
                });
            }
            return aResult;
        }

    };
});
