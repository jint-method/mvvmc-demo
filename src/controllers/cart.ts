import { message } from "wwibs";
import { ILineItem, IProduct } from "../types";
import { getProductById } from "./store";

class Cart{
    private lineItems: {
        [uid:string]: ILineItem;
    };

    constructor(){
        this.lineItems = {};
    }

    public addLineItem(productUid:string):void {
        if (!this.lineItems?.[productUid]){
            const product:IProduct = getProductById(productUid);
            const lineItem:Partial<ILineItem> = {...product};
            lineItem.qty = 1;
            this.lineItems[productUid] = lineItem as ILineItem;
            message({
                recipient: "cart",
                type: "add-line-item",
                data: {
                    lineItem: lineItem,
                },
            });
        } else {
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

    public updateLineItem(productUid:string, qty:number):void{
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

    public removeLineItem(productUid:string):void{
        delete this.lineItems[productUid];
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
const addLineItem: (productUid:string)=>void = cart.addLineItem.bind(cart);
const updateLineItemQuantity: (productUid:string, qty:number)=>void = cart.updateLineItem.bind(cart);
const removeLineItem: (productUid:string)=>void = cart.removeLineItem.bind(cart);
export { cart, addLineItem, updateLineItemQuantity, removeLineItem };