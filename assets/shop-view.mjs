import { hookup } from "./wwibs.mjs";
import { html, render } from "./lit-html.mjs";
import { Component } from "./component.mjs";
import { ProductCard } from "./product-card.mjs";
customElements.define("product-card", ProductCard);
import { LoadMoreButton } from "./load-more-button.mjs";
customElements.define('load-more-button', LoadMoreButton);
const itemsPerPage = 16;
export default class ShopView extends Component {
    constructor() {
        super();
        this.state = {
            view: "loading",
            page: 0,
            totalPages: 0,
            products: [],
        };
        hookup("store", this.inbox.bind(this));
    }
    inbox(msg) {
        switch (msg.type) {
            case "load-page":
                this.setState({ page: this.state.page + 1 });
                break;
            case "render":
                const updatedState = { ...this.state };
                updatedState.view = "idling";
                updatedState.totalPages = Math.floor(msg.products.length / itemsPerPage);
                updatedState.page = 0;
                updatedState.products = msg.products;
                this.setState(updatedState);
                break;
            default:
                break;
        }
    }
    render() {
        let view = null;
        const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        switch (this.state.view) {
            case "loading":
                view = html `
                    <svg-spinner class="font-primary-700">
                        <svg style="width:32px;height:32px;" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path class="fa-secondary" fill="currentColor" d="M478.71 364.58zm-22 6.11l-27.83-15.9a15.92 15.92 0 0 1-6.94-19.2A184 184 0 1 1 256 72c5.89 0 11.71.29 17.46.83-.74-.07-1.48-.15-2.23-.21-8.49-.69-15.23-7.31-15.23-15.83v-32a16 16 0 0 1 15.34-16C266.24 8.46 261.18 8 256 8 119 8 8 119 8 256s111 248 248 248c98 0 182.42-56.95 222.71-139.42-4.13 7.86-14.23 10.55-22 6.11z" opacity="0.4"></path><path class="fa-primary" fill="currentColor" d="M271.23 72.62c-8.49-.69-15.23-7.31-15.23-15.83V24.73c0-9.11 7.67-16.78 16.77-16.17C401.92 17.18 504 124.67 504 256a246 246 0 0 1-25 108.24c-4 8.17-14.37 11-22.26 6.45l-27.84-15.9c-7.41-4.23-9.83-13.35-6.2-21.07A182.53 182.53 0 0 0 440 256c0-96.49-74.27-175.63-168.77-183.38z"></path></g></svg>
                    </svg-spinner>
                `;
                break;
            default:
                view = html `
                    <div class="container">
                        ${this.state.products.map((product, index) => {
                    if (index < this.state.page * itemsPerPage + itemsPerPage) {
                        const diff = 5 - product.rating;
                        console.log(Array(product.rating));
                        return html `
                                    <product-card class="bg-white border-1 border-solid border-grey-300 radius-0.5" view="primary">
                                        <card-content class="block w-full h-full">
                                            <img-shim>
                                                <img draggable="false" src="/images/${product.filename}" alt="${product.description}" />
                                            </img-shim>
                                            <h2 class="w-full line-snug text-capitalize font-medium" flex="justify-between row nowrap">
                                                <span style="flex: 1;" class="inline-block font-grey-800">${product.title}</span>
                                                <span class="inline-block font-success-700 ml-1">${priceFormatter.format(product.price)}</span>
                                            </h2>
                                            <div class="rating" aria-label="rated ${product.rating}/5">
                                                ${Array.apply(null, Array(product.rating)).map(() => {
                            return html `<svg class="-solid" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>`;
                        })}
                                                ${Array.apply(null, Array(diff)).map(() => {
                            return html `<svg class="-outline" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z"></path></svg>`;
                        })}
                                            </div>
                                            <product-description>${product.description}</product-description>
                                        </card-content>
                                        <div class="actions-container" flex="justify-between items-center">
                                            <button class="js-add-to-cart-button button -outline -black">add to cart</button>
                                            <button class="js-description-button button -outline -black -icon-only -round" title="view description" aria-label="view description">
                                                <i>
                                                    <svg style="width:14px;height:14px;" class="-info" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path></svg>
                                                    <svg class="-close" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
                                                </i>
                                            </button>
                                        </div>
                                    </product-card>
                                `;
                    }
                })}
                    </div>
                    ${this.state.page < this.state.totalPages ? html `
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
