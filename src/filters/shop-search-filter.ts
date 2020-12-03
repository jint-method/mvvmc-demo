import { search } from "../controllers/store";

export default class ShopSearchFilter extends HTMLElement{
    private input: HTMLInputElement;

    constructor(){
        super();
        this.input = this.querySelector("input");
    }

    private handleInput:EventListener = ()=>{
        search(this.input.value);
    }

    connectedCallback(){
        this.input.addEventListener("input", this.handleInput);
    }

    disconenctedCallback(){
        this.input.removeEventListener("input", this.handleInput);
    }
}