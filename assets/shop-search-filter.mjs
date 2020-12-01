import { search } from "./controller.mjs";
export default class ShopSearchFilter extends HTMLElement {
    constructor() {
        super();
        this.handleInput = () => {
            search(this.input.value);
        };
        this.input = this.querySelector("input");
    }
    connectedCallback() {
        this.input.addEventListener("input", this.handleInput);
    }
    disconenctedCallback() {
        this.input.removeEventListener("input", this.handleInput);
    }
}
