import { html, render } from "./lit-html.mjs";
import { hookup } from "./wwibs.mjs";
import { Component } from "./component.mjs";
import { CloseCartButton } from "./close-cart-button.mjs";
customElements.define("close-cart-button", CloseCartButton);
import { LineItem } from "./line-item.mjs";
customElements.define("line-item", LineItem);
export default class CartDrawer extends Component {
    constructor() {
        super();
        this.state = {
            lineItems: [],
            open: false,
        };
        hookup("cart", this.inbox.bind(this));
    }
    inbox(data) {
        switch (data.type) {
            case "add-line-item":
                this.addLineItem(data.lineItem);
                break;
            case "update-line-item":
                this.updateLineItem(data.uid, data.qty);
                break;
            case "open":
                this.setState({ open: true });
                break;
            case "close":
                this.setState({ open: false });
                break;
            default:
                console.warn(`Unhandled Cart Drawer message type: ${data.type}`);
                break;
        }
    }
    addLineItem(lineItem) {
        const updatedState = { ...this.state };
        updatedState.lineItems.push(lineItem);
        updatedState.open = true;
        this.setState(updatedState);
    }
    updateLineItem(uid, qty) {
        const updatedState = { ...this.state };
        for (let i = 0; i < updatedState.lineItems.length; i++) {
            if (updatedState.lineItems[i].id === uid) {
                updatedState.lineItems[i].qty = qty;
                break;
            }
        }
        updatedState.open = true;
        this.setState(updatedState);
    }
    render() {
        const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        let subtotal = 0;
        this.state.lineItems.map((lineItem) => {
            subtotal += lineItem.price * lineItem.qty;
        });
        this.setAttribute("state", this.state.open ? "open" : "closed");
        const view = html `
            <div class="w-full mb-1 text-right">
                <close-cart-button role="button" tabindex="0" class="button -text -grey -round -icon-only">
                    <i>
                        <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>
                    </i>
                </close-cart-button>
            </div>
            <div class="container">
                ${this.state.lineItems.map((lineItem) => {
            return html `
                        <line-item data-id="${lineItem.id}" data-qty="${lineItem.qty}">
                            <h3>${lineItem.title}</h3>
                            <h4>${lineItem.price} each</h4>
                            <div class="w-full" flex="items-center">
                                <button class="js-subtract button -primary -outline -round -icon-only" title="remove one ${lineItem.title.toLowerCase()}">
                                    <i>
                                        <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M376 232H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h368c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"></path></svg>
                                    </i>
                                </button>
                                <span>${lineItem.qty}</span>
                                <button class="js-add button -primary -outline -round -icon-only" title="add one ${lineItem.title.toLowerCase()}">
                                    <i>
                                        <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"></path></svg>
                                    </i>
                                </button>
                            </div>
                        </line-item>
                    `;
        })}
            </div>
            <div class="actions">
                <span class="w-full block text-center font-medium my-0.5">Subtotal ${priceFormatter.format(subtotal)}</span>
                <button class="button -solid -primary mt-1 w-full">checkout</button>
            </div>
        `;
        render(view, this);
    }
}
