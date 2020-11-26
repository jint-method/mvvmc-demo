import { hookup } from "wwibs";
import { html, render } from "lit-html";
import { IProduct } from "../types";
import { Component } from "../component";

import { ProductCard } from "./product-card";
customElements.define("product-card", ProductCard);

import { LoadMoreButton } from "./load-more-button";
customElements.define('load-more-button', LoadMoreButton);

type IShopViewState = {
    view: "loading" | "idling";
    page: number;
    totalPages: number;
    products: Array<IProduct>,
};

export default class ShopView extends Component<IShopViewState>{

    constructor(){
        super();
        this.state = {
            view: "loading",
            page: 0,
            totalPages: 0,
            products: [],
        };
        hookup("store", this.inbox.bind(this));
    }

    private inbox(msg):void{
        switch (msg.type){
            case "load-page":
                this.setState({page: this.state.page + 1});
                break;
            case "render":
                const updatedState = {...this.state};
                updatedState.view = "idling";
                updatedState.totalPages = Math.floor(msg.products.length / 9);
                updatedState.page = 0;
                updatedState.products = msg.products;
                this.setState(updatedState);
                break;
            default:
                break;
        }
    }

    render(){
        let view = null;
        const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        switch(this.state.view){
            case "loading":
                view = html`
                    <svg-spinner class="font-primary-700">
                        <svg style="width:32px;height:32px;" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M478.71 364.58zm-22 6.11l-27.83-15.9a15.92 15.92 0 0 1-6.94-19.2A184 184 0 1 1 256 72c5.89 0 11.71.29 17.46.83-.74-.07-1.48-.15-2.23-.21-8.49-.69-15.23-7.31-15.23-15.83v-32a16 16 0 0 1 15.34-16C266.24 8.46 261.18 8 256 8 119 8 8 119 8 256s111 248 248 248c98 0 182.42-56.95 222.71-139.42-4.13 7.86-14.23 10.55-22 6.11z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M271.23 72.62c-8.49-.69-15.23-7.31-15.23-15.83V24.73c0-9.11 7.67-16.78 16.77-16.17C401.92 17.18 504 124.67 504 256a246 246 0 0 1-25 108.24c-4 8.17-14.37 11-22.26 6.45l-27.84-15.9c-7.41-4.23-9.83-13.35-6.2-21.07A182.53 182.53 0 0 0 440 256c0-96.49-74.27-175.63-168.77-183.38z"></path></g></svg>
                    </svg-spinner>
                `;
                break;
            default:
                view = html`
                    <div class="container">
                        ${this.state.products.map((product, index) => {
                            if (index < this.state.page * 9 + 9){
                                return html`
                                    <product-card class="bg-white border-1 border-solid border-grey-300 radius-0.5">
                                        <img-shim>
                                            <img draggable="false" src="/images/${product.filename}" alt="image of ${product.title}" />
                                        </img-shim>
                                        <h2 class="w-full line-snug text-capitalize font-medium" flex="justify-between row nowrap">
                                            <span style="flex: 1;" class="inline-block font-grey-800">${product.title}</span>
                                            <span class="inline-block font-primary-700 ml-1">${priceFormatter.format(product.price)}</span>
                                        </h2>
                                        <button class="button -outline -primary">add to cart</button>
                                    </product-card>
                                `;
                            }
                        })}
                    </div>
                    ${this.state.page < this.state.totalPages ? html`
                        <div class="block w-full text-center mt-3">
                            <load-more-button role="button" tabindex="0" class="button -solid -primary -rounded">load more products</load-more-button>
                        </div>
                    ` : null}
                `;
                break;
        }
        this.setAttribute("state", this.state.view);
        render(view, this);
    }
}