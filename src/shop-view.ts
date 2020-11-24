import { hookup } from "wwibs";
import { html, render } from "lit-html";
import { IProduct } from "./types";

import { ProductCard } from "./product-card";
customElements.define("product-card", ProductCard);

export default class ShopView extends HTMLElement{

    constructor(){
        super();
        hookup("store", this.inbox.bind(this));
    }

    private inbox(msg):void{
        switch (msg.type){
            case "render":
                this.render(msg.products);
                break;
            default:
                break;
        }
    }

    private render(products:Array<IProduct>):void{
        const template = html`${
            products.map(product => (
                html`
                    <product-card>
                        <img-shim>
                            <img draggable="false" src="/images/${product.filename}" alt="image of ${product.title}" />
                        </img-shim>
                        <h2>${product.title}</h2>
                        <p>${product.description}</p>
                        <button class="button -solid -primary">add to cart</button>
                    </product-card>
                `
            ))
        }`;
        render(template, this);
    }
}