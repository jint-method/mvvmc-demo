import { message } from "./wwibs.mjs";
class Store {
    constructor() {
        this.worker = new Worker(`${location.origin}/assets/worker.mjs`);
        this.worker.onmessage = this.workerInbox.bind(this);
        this.products = [];
    }
    workerInbox(e) {
        const msg = e.data;
        switch (msg.type) {
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
    sendMessage(type, data = null) {
        this.worker.postMessage({
            type: type,
            data: data,
        });
    }
    search(query) {
        this.sendMessage("search", query.trim());
    }
    sort(sort) {
        this.sendMessage("sort", sort);
    }
    updateCategory(category) {
        this.sendMessage("category", category);
    }
    reset() {
        this.sendMessage("reset");
    }
    getProductById(productUid) {
        let ret = null;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === productUid) {
                ret = this.products[i];
                break;
            }
        }
        return ret;
    }
}
const store = new Store();
const search = store.search.bind(store);
const sort = store.sort.bind(store);
const updateCategory = store.updateCategory.bind(store);
const reset = store.reset.bind(store);
const getProductById = store.getProductById.bind(store);
export { store, search, sort, updateCategory, reset, getProductById };
