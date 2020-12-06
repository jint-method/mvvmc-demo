import { message } from "./wwibs.mjs";
export default class OpenCartButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.openCart = () => {
            message({
                recipient: "cart",
                type: "open",
            });
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.openCart);
    }
}
