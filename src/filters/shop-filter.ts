import { reset } from "../controllers/store";

export default class ShopFilter extends HTMLElement{
    private form:HTMLFormElement;
    constructor(){
        super();
        this.form = this.querySelector('form');
    }
    private handleReset:EventListener = ()=>{
        reset();
    }
    connectedCallback(){
        this.form.addEventListener("reset", this.handleReset);
        this.form.addEventListener("submit", (e)=>{e.preventDefault();});
    }
}