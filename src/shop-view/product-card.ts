export class ProductCard extends HTMLElement{
    private addToCartButton:HTMLButtonElement;

    constructor(){
        super();
        this.addToCartButton = this.querySelector("button");
    }

    private addToCart:EventListener = ()=>{}

    connectedCallback(){
        this.addToCartButton.addEventListener("click", this.addToCart);
    }
}