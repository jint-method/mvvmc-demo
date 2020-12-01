class StoreWorker {
    constructor() {
        self.onmessage = this.inbox.bind(this);
        this.state = {
            products: [],
            query: null,
            activeCategory: null,
            sort: "price-lh",
        };
        this.fetchProducts();
    }
    inbox(e) {
        const message = e.data;
        switch (message.type) {
            case "reset":
                const updatedState = { ...this.state };
                updatedState.query = null;
                updatedState.activeCategory = null;
                updatedState.sort = "price-lh";
                this.state = updatedState;
                this.update();
                break;
            case "search":
                this.state.query = message.data.length ? message.data : null;
                this.update();
                break;
            case "category":
                this.state.activeCategory = message.data.length ? message.data : null;
                this.update();
                break;
            case "sort":
                this.state.sort = message.data;
                this.update();
                break;
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
            this.update();
        }
        else {
            console.error(`Failed to fetch products from API. Server responded with: ${request.status}:${request.statusText}`);
        }
    }
    filterByCategory(products) {
        if (!this.state.activeCategory) {
            return products;
        }
        let ret = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].type === this.state.activeCategory) {
                ret.push(products[i]);
            }
        }
        return ret;
    }
    search(products) {
        if (!this.state.query) {
            return products;
        }
        let ret = [];
        const RegexQuery = new RegExp(this.state.query);
        for (let i = 0; i < products.length; i++) {
            if (RegexQuery.test(products[i].title) || RegexQuery.test(products[i].description)) {
                ret.push(products[i]);
            }
        }
        return ret;
    }
    sort(products) {
        let ret = [];
        for (let i = 0; i < products.length; i++) {
            if (i === 0) {
                ret.push(products[i]);
            }
            else {
                let placedProduct = false;
                for (let k = 0; k < ret.length; k++) {
                    switch (this.state.sort) {
                        case "price-hl":
                            if (products[i].price >= ret[k].price) {
                                ret.splice(k, 0, products[i]);
                                placedProduct = true;
                            }
                            break;
                        case "price-lh":
                            if (products[i].price <= ret[k].price) {
                                ret.splice(k, 0, products[i]);
                                placedProduct = true;
                            }
                            break;
                        case "rating-hl":
                            if (products[i].rating >= ret[k].rating) {
                                ret.splice(k, 0, products[i]);
                                placedProduct = true;
                            }
                            break;
                        case "rating-lh":
                            if (products[i].rating <= ret[k].rating) {
                                ret.splice(k, 0, products[i]);
                                placedProduct = true;
                            }
                            break;
                    }
                    if (placedProduct) {
                        break;
                    }
                }
                if (!placedProduct) {
                    ret.push(products[i]);
                }
            }
        }
        return ret;
    }
    update() {
        let products = [...this.state.products];
        products = this.filterByCategory(products);
        products = this.search(products);
        products = this.sort(products);
        this.sendMessage("render", products);
    }
}
new StoreWorker();
