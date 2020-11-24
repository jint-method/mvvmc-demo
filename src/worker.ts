type IProduct = {
    title: string;
    type: string;
    description: string;
    filename: string;
    height: number;
    width: number;
    price: number;
    rating: number;
}

type IStoreWorkerState = {
    products: Array<IProduct>;
    query: string;
    activeCategory: "dairy" | "fruit" | "vegetable" | "bakery" | "meat";
    sort: "price-hl" | "price-lh" | "rating-hl" | "rating-lh";
}

class StoreWorker{
    private state: IStoreWorkerState;

    constructor(){
        self.onmessage = this.inbox.bind(this);
        this.state = {
            products: [],
            query: null,
            activeCategory: null,
            sort: "price-hl",
        };
        this.fetchProducts();
    }

    private inbox(e:MessageEvent):void{
        const message = e.data;
        switch (message.type){
            default:
                console.warn(`Unknown store worker inbox message type: ${message.type}`);
                break;
        }
    }

    private sendMessage(type:string, data:any):void{
        // @ts-expect-error
        self.postMessage({
            type: type,
            data: data,
        });
    }         

    private async fetchProducts():Promise<void>{
        const request = await fetch(`/products.json`, {
            headers: new Headers({
                Accept: "application/json",
            }),
        });
        if (request.ok){
            const response = await request.json();
            this.state.products = response;
            this.sendMessage("render", this.state.products);
        }else{
            console.error(`Failed to fetch products from API. Server responded with: ${request.status}:${request.statusText}`);
        }
    }
}
new StoreWorker();