import { message } from "./wwibs.mjs";
class Store {
    constructor() {
        this.worker = new Worker(`${location.origin}/assets/worker.mjs`);
        this.worker.onmessage = this.workerInbox.bind(this);
    }
    workerInbox(e) {
        const msg = e.data;
        switch (msg.type) {
            case "render":
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
    sendMessage(type, data) {
        this.worker.postMessage({
            type: type,
            data: data,
        });
    }
    search(query) {
        if (query.length) {
            this.sendMessage("search", query.trim());
        }
    }
    sort(sort) {
        this.sendMessage("sort", sort);
    }
    updateCategory(category) {
        this.sendMessage("category", category);
    }
}
const store = new Store();
const search = store.search.bind(store);
const sort = store.sort.bind(store);
const updateCategory = store.updateCategory.bind(store);
export { store, search, sort, updateCategory };
