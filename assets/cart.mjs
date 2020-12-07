import { message } from "./wwibs.mjs";
import { getProductById } from "./store.mjs";
class Cart {
    constructor() {
        this.lineItems = {};
    }
    addLineItem(productUid) {
        var _a;
        if (!((_a = this.lineItems) === null || _a === void 0 ? void 0 : _a[productUid])) {
            const product = getProductById(productUid);
            const lineItem = { ...product };
            lineItem.qty = 1;
            this.lineItems[productUid] = lineItem;
            // TODO: send new line item to the cart on the server
            message({
                recipient: "cart",
                type: "add-line-item",
                data: {
                    lineItem: lineItem,
                },
            });
        }
        else {
            this.updateLineItem(productUid, this.lineItems[productUid].qty + 1);
        }
    }
    updateLineItem(productUid, qty) {
        this.lineItems[productUid].qty = qty;
        // TODO: send new quantity to the cart on the server
        message({
            recipient: "cart",
            type: "update-line-item",
            data: {
                uid: productUid,
                qty: this.lineItems[productUid].qty,
            },
        });
    }
    removeLineItem(productUid) {
        delete this.lineItems[productUid];
        // TODO: remove line item from the cart on the server
        message({
            recipient: "cart",
            type: "remove-line-item",
            data: {
                uid: productUid,
            },
        });
    }
}
const cart = new Cart();
const addLineItem = cart.addLineItem.bind(cart);
const updateLineItemQuantity = cart.updateLineItem.bind(cart);
const removeLineItem = cart.removeLineItem.bind(cart);
export { cart, addLineItem, updateLineItemQuantity, removeLineItem };
