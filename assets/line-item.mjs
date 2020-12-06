import { updateLineItemQuantity } from "./cart.mjs";
export class LineItem extends HTMLElement {
    constructor() {
        super();
        this.add = () => {
            let value = parseInt(this.dataset.qty);
            value++;
            if (value > 999) {
                value = 999;
            }
            updateLineItemQuantity(this.dataset.id, value);
        };
        this.subtract = () => {
            let value = parseInt(this.dataset.qty);
            value--;
            if (value < 1) {
                value = 1;
            }
            updateLineItemQuantity(this.dataset.id, value);
        };
        this.addButton = this.querySelector(".js-add");
        this.subtractButton = this.querySelector(".js-subtract");
    }
    connectedCallback() {
        this.addButton.addEventListener("click", this.add);
        this.subtractButton.addEventListener("click", this.subtract);
    }
}
