class StoreWorker {
    constructor() {
        self.onmessage = this.inbox.bind(this);
        this.state = {
            products: [],
            query: null,
            activeCategory: null,
            sort: "price-hl",
        };
        this.fetchProducts();
    }
    inbox(e) {
        const message = e.data;
        switch (message.type) {
            default:
                console.warn(`Unknown store worker inbox message type: ${message.type}`);
                break;
        }
    }
    sendMessage(type, data) {
        // @ts-expect-error
        self.postMessage({
            type: type,
            data: data,
        });
    }
    async fetchProducts() {
        const request = await fetch(`/products.json`, {
            headers: new Headers({
                Accept: "application/json",
            }),
        });
        if (request.ok) {
            const response = await request.json();
            this.state.products = response;
            this.sendMessage("render", this.state.products);
        }
        else {
            console.error(`Failed to fetch products from API. Server responded with: ${request.status}:${request.statusText}`);
        }
    }
}
new StoreWorker();
