import { reset } from "./store.mjs";
export default class ShopFilter extends HTMLElement {
    constructor() {
        super();
        this.handleReset = () => {
            reset();
        };
        this.form = this.querySelector('form');
    }
    connectedCallback() {
        this.form.addEventListener("reset", this.handleReset);
        this.form.addEventListener("submit", (e) => { e.preventDefault(); });
    }
}
