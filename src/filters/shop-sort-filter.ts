import { sort } from "../controller";

export default class ShopSortFilter extends HTMLElement{
    private input: HTMLSelectElement;

    constructor(){
        super();
        this.input = this.querySelector("select");
    }

    private handleInput:EventListener = ()=>{
        // @ts-expect-error
        sort(this.input.value);
    }

    connectedCallback(){
        this.input.addEventListener("change", this.handleInput);
    }

    disconenctedCallback(){
        this.input.removeEventListener("change", this.handleInput);
    }
}