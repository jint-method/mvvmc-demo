import { Component } from "../../component";

type ProductCardState = {
    view: "primary" | "secondary";
}
export class ProductCard extends Component<ProductCardState>{
    private addToCartButton:HTMLButtonElement;
    private toggleDescriptionButton:HTMLButtonElement;

    constructor(){
        super();
        this.state = {
            view: "primary",
        };
        this.addToCartButton = this.querySelector(".js-add-to-cart-button");
        this.toggleDescriptionButton = this.querySelector(".js-description-button");
    }

    private addToCart:EventListener = ()=>{}

    private toggleDescription:EventListener = ()=>{
        this.setState({view: this.state.view === "primary" ? "secondary" : "primary"});
    }

    connected(){
        this.addToCartButton.addEventListener("click", this.addToCart);
        this.toggleDescriptionButton.addEventListener("click", this.toggleDescription);
    }

    render(){
        this.setAttribute("view", this.state.view);
        if (this.state.view === "primary"){
            this.toggleDescriptionButton.setAttribute("title", "view description");
            this.toggleDescriptionButton.setAttribute("aria-label", "view description");
        }else{
            this.toggleDescriptionButton.setAttribute("title", "close description");
            this.toggleDescriptionButton.setAttribute("aria-label", "close description");
        }
    }
}