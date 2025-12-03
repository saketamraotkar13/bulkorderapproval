sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (MessageToast, MessageBox, Fragment) {
    'use strict';

    return {

        // ========================================
        // SHOW KPIs - NOW WITH FILTERS SUPPORT
        // ========================================
        onShowKPIs: function (oEvent, oEvt) {
            MessageToast.show("Loading KPI Dashboard...");

            var oModel = this.getModel();
            var that = this;

            // Get current filters from FilterBar (same logic as onBulkApproval)
            const flattenFilters = function (oFilter) {
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

            console.log("📊 Filters for KPI:", JSON.stringify(aFilters));

            // Show busy indicator
            sap.ui.core.BusyIndicator.show(0);

            // Call CAP function to get KPI data WITH FILTERS
            var oFunctionContext = oModel.bindContext("/getApprovalStats(...)");
            oFunctionContext.setParameter("filters", JSON.stringify(aFilters));

            oFunctionContext.execute()
                .then(function () {
                    // Get the data
                    var oKPIData = oFunctionContext.getBoundContext().getObject();
                    console.log("KPI Data received:", oKPIData);

                    sap.ui.core.BusyIndicator.hide();

                    // Open dialog with data
                    if (!that._kpiDialog) {
                        Fragment.load({
                            id: "kpiFragment",
                            name: "uibworderapproval.ext.fragments.ApprovalStats",
                            controller: that
                        }).then(function (oDialog) {
                            that._kpiDialog = oDialog;

                            // Create and set KPI model with chart data
                            var oKPIModel = new sap.ui.model.json.JSONModel({
                                totalOrders: oKPIData.totalOrders || 0,
                                approvedOrders: oKPIData.approvedOrders || 0,
                                rejectedOrders: oKPIData.rejectedOrders || 0,
                                pendingOrders: oKPIData.pendingOrders || 0,
                                approvalRate: oKPIData.approvalRate || 0,
                                rejectionRate: oKPIData.rejectionRate || 0,
                                pendingRate: oKPIData.pendingRate || 0,
                                sumOfQuantity: oKPIData.sumOfQuantity || 0,
                                sumOfProfitAtRisk: oKPIData.sumOfProfitAtRisk || 0,
                                lastUpdated: new Date().toLocaleString(),
                                // Chart data format
                                chartData: [
                                    {
                                        status: "Approved",
                                        count: oKPIData.approvedOrders || 0
                                    },
                                    {
                                        status: "Rejected",
                                        count: oKPIData.rejectedOrders || 0
                                    },
                                    {
                                        status: "Pending",
                                        count: oKPIData.pendingOrders || 0
                                    }
                                ]
                            });

                            that._kpiDialog.setModel(oKPIModel, "kpi");
                            that._kpiDialog.open();

                            console.log("Dialog opened with KPI data");
                        }).catch(function (error) {
                            console.error("Error loading fragment:", error);
                            MessageBox.error("Failed to load fragment: " + error.message);
                        });
                    } else {
                        // Dialog exists - update data and reopen
                        var oKPIModel = that._kpiDialog.getModel("kpi");
                        oKPIModel.setData({
                            totalOrders: oKPIData.totalOrders || 0,
                            approvedOrders: oKPIData.approvedOrders || 0,
                            rejectedOrders: oKPIData.rejectedOrders || 0,
                            pendingOrders: oKPIData.pendingOrders || 0,
                            approvalRate: oKPIData.approvalRate || 0,
                            rejectionRate: oKPIData.rejectionRate || 0,
                            pendingRate: oKPIData.pendingRate || 0,
                            sumOfQuantity: oKPIData.sumOfQuantity || 0,
                            sumOfProfitAtRisk: oKPIData.sumOfProfitAtRisk || 0,
                            lastUpdated: new Date().toLocaleString(),
                            chartData: [
                                {
                                    status: "Approved",
                                    count: oKPIData.approvedOrders || 0
                                },
                                {
                                    status: "Rejected",
                                    count: oKPIData.rejectedOrders || 0
                                },
                                {
                                    status: "Pending",
                                    count: oKPIData.pendingOrders || 0
                                }
                            ]
                        });

                        that._kpiDialog.open();
                        console.log("Dialog reopened with refreshed data");
                    }
                })
                .catch(function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Failed to load KPI data:", oError);
                    MessageBox.error("Failed to load KPI statistics: " + (oError.message || "Unknown error"));
                });
        },

        onCloseTableDialog: function () {
            if (this._kpiDialog) {
                this._kpiDialog.close();
            }
        },

        // ========================================
        // BULK ORDER APPROVAL - UNCHANGED
        // ========================================
        onBulkApproval: async function (oContext, aSelectedContexts) {
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                sap.m.MessageBox.warning("Please select at least one order.");
                return;
            }

            const oModel = aSelectedContexts[0].getModel();
            const aSelectedOrders = aSelectedContexts.map(ctx => ctx.getObject());

            // Pass composite keys (orderNumber + itemNumber)
            const aOrders = aSelectedOrders.map(o => ({
                orderNumber: o.orderNumber,
                itemNumber: o.itemNumber
            }));

            const countSelectedOrders = aSelectedOrders.length;

            // Flatten FE filters
            const flattenFilters = function (oFilter) {
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

            // Controls
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

            oApproveCheckbox.attachSelect(function (oEvent) {
                var bApprove = oEvent.getParameter("selected");
                oReasonCombo.setEnabled(!bApprove);
                oReasonCombo.setRequired(!bApprove);
                // Clear reason code when approving
                if (bApprove) {
                    oReasonCombo.setSelectedKey("");
                }
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
            oSelectAllCheckbox.attachSelect(function (oEvent) {
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
                            let lastResponse = null;
                            sap.ui.core.BusyIndicator.show(0);

                            for (const ordersChunk of chunkedOrders) {
                                var oAction = oModel.bindContext("/approveOrders(...)");
                                oAction.setParameter("orders", ordersChunk);
                                oAction.setParameter("approveLoad", bApproveLoad);
                                // Only pass reasonCode if not approving
                                oAction.setParameter("reasonCode", bApproveLoad ? "" : sReasonCode);
                                oAction.setParameter("filters", JSON.stringify(aFilters));
                                oAction.setParameter("allSelected", bSelectAll);

                                await oAction.execute();
                                lastResponse = oAction.getBoundContext().getObject();
                                console.log(lastResponse);
                            }
                            sap.ui.core.BusyIndicator.hide();
                            
                            if (lastResponse && lastResponse.message) 
                                {
                                    sap.m.MessageToast.show(lastResponse.message);
                                    oModel.refresh();
                            } else {
                                sap.m.MessageToast.show("Orders processed successfully.");
                                oModel.refresh();
                            }
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
        }
    };
});
