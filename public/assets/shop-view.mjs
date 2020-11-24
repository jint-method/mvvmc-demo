import { hookup } from "./wwibs.mjs";
import { html, render } from "./lit-html.mjs";
import { ProductCard } from "./product-card.mjs";
customElements.define("product-card", ProductCard);
export default class ShopView extends HTMLElement {
    constructor() {
        super();
        hookup("store", this.inbox.bind(this));
    }
    inbox(msg) {
        switch (msg.type) {
            case "render":
                this.render(msg.products);
                break;
            default:
                break;
        }
    }
    render(products) {
        const template = html `${products.map(product => (html `
                    <product-card>
                        <img-shim>
                            <img draggable="false" src="/images/${product.filename}" alt="image of ${product.title}" />
                        </img-shim>
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <button class="button -solid -primary">add to cart</button>
                    </product-card>
                `))}`;
        render(template, this);
    }
}
