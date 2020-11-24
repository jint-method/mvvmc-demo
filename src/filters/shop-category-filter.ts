import { updateCategory } from "../controller";

export default class ShopCategoryFilter extends HTMLElement{
    private input: HTMLSelectElement;

    constructor(){
        super();
        this.input = this.querySelector("select");
    }

    private handleInput:EventListener = ()=>{
        // @ts-ignore
        updateCategory(this.input.value);
    }

    connectedCallback(){
        this.input.addEventListener("change", this.handleInput);
    }

    disconenctedCallback(){
        this.input.removeEventListener("change", this.handleInput);
    }
}