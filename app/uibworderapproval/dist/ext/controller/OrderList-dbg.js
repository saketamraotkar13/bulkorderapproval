sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        onBulkApproval: async function (oContext, aSelectedContexts) {
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                sap.m.MessageBox.warning("Please select at least one order.");
                return;
            }

            var aOrders = aSelectedContexts.map(ctx => ctx.getObject().orderNumber);
            var oModel = aSelectedContexts[0].getModel();

            // Reason Code ComboBox (always enabled)
            var oReasonCombo = new sap.m.ComboBox({
                width: "100%",
                placeholder: "Select Reason Code...",
                enabled: true,
                items: {
                    path: "/reasonCodeVH",
                    template: new sap.ui.core.ListItem({
                        key: "{reasonCode}",
                        text: "{reasonCode} - {description}"
                    })
                }
            });

            // Approve Checkbox
            var oApproveCheckbox = new sap.m.CheckBox({
                text: "Approve Load",
                width: "90%",
                selected: true
            });

            // VBox layout
            var oVBox = new sap.m.VBox({
                width: "90%",
                items: [
                    oApproveCheckbox,
                    new sap.m.Label({ text: "Reason Code", design: "Bold" }),
                    oReasonCombo
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

                        // Validation: Reason required only when rejecting
                        if (!bApproveLoad && !sReasonCode) {
                            sap.m.MessageBox.warning("Reason Code is required when rejecting the order.");
                            return;
                        }

                        try {
                            // 🔹 Split orders into chunks (e.g., 200 per batch)
                            function chunkArray(array, size) {
                                const result = [];
                                for (let i = 0; i < array.length; i += size) {
                                    result.push(array.slice(i, i + size));
                                }
                                return result;
                            }

                            const chunkedOrders = chunkArray(aOrders, 200);

                            // 🔹 Process each chunk sequentially
                            for (const ordersChunk of chunkedOrders) {
                                var oAction = oModel.bindContext("/approveOrders(...)");
                                oAction.setParameter("orders", ordersChunk);
                                oAction.setParameter("approveLoad", bApproveLoad);
                                if (sReasonCode) {
                                    oAction.setParameter("reasonCode", sReasonCode);
                                }
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

            // Attach model
            oDialog.setModel(oModel);
            oDialog.addStyleClass("sapUiContentPadding sapUiSizeCompact");
            oDialog.open();
        }


    };
});