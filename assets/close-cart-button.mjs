import { message } from "./wwibs.mjs";
export class CloseCartButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.closeCart = () => {
            message({
                recipient: "cart",
                type: "close",
            });
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.closeCart);
    }
}
