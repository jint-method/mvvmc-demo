import { message } from "wwibs";
import { IProduct } from "../types";

class Store{
    private worker: Worker;
    private products: Array<IProduct>;

    constructor(){
        this.worker = new Worker(`${location.origin}/assets/worker.mjs`);
        this.worker.onmessage = this.workerInbox.bind(this);
        this.products = [];
    }

    private workerInbox(e:MessageEvent){
        const msg = e.data;
        switch (msg.type){
            case "render":
                this.products = msg.data;
                message({
                    recipient: "store",
                    type: "render",
                    data: {
                        products: msg.data,
                    },
                    maxAttempts: Infinity,
                });
                break;
            default:
                console.warn(`Unknown store inbox message type: ${msg.type}`);
                break;
        }
    }

    private sendMessage(type:string, data:any = null):void{
        this.worker.postMessage({
            type: type,
            data: data,
        });
    }

    public search(query:string):void{
        this.sendMessage("search", query.trim());
    }

    public sort(sort:string):void{
        this.sendMessage("sort", sort);
    }

    public updateCategory(category:string):void{
        this.sendMessage("category", category);
    }

    public reset():void{
        this.sendMessage("reset");
    }

    public getProductById(productUid: string): IProduct{
        let ret = null;
        for (let i = 0; i < this.products.length; i++){
            if (this.products[i].id === productUid){
                ret = this.products[i];
                break;
            }
        }
        return ret;
    }
}
const store = new Store();
const search:(query:string)=>void = store.search.bind(store);
const sort:(sortType:"price-hl" | "price-lh" | "rating-hl" | "rating-lh")=>void = store.sort.bind(store);
const updateCategory:(category: "dairy" | "fruit" | "vegetable" | "bakery" | "meat")=>void = store.updateCategory.bind(store);
const reset:()=>void = store.reset.bind(store);
const getProductById:(productUid: string)=>IProduct = store.getProductById.bind(store);
export { store, search, sort, updateCategory, reset, getProductById };