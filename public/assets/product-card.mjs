export class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.addToCart = () => { };
        this.addToCartButton = this.querySelector("button");
    }
    connectedCallback() {
        this.addToCartButton.addEventListener("click", this.addToCart);
    }
}
