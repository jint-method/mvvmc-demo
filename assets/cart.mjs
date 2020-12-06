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
            message({
                recipient: "cart",
                type: "add-line-item",
                data: {
                    lineItem: lineItem,
                },
            });
        }
        else {
            this.lineItems[productUid].qty++;
            message({
                recipient: "cart",
                type: "update-line-item",
                data: {
                    uid: productUid,
                    qty: this.lineItems[productUid].qty,
                },
            });
        }
    }
    updateLineItem(productUid, qty) {
        this.lineItems[productUid].qty = qty;
        message({
            recipient: "cart",
            type: "update-line-item",
            data: {
                uid: productUid,
                qty: this.lineItems[productUid].qty,
            },
        });
    }
}
const cart = new Cart();
const addLineItem = cart.addLineItem.bind(cart);
const updateLineItemQuantity = cart.updateLineItem.bind(cart);
export { cart, addLineItem, updateLineItemQuantity };
