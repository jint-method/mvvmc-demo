import { message } from "wwibs";

export default class OpenCartButton extends HTMLElement{
    private openCart:EventListener = ()=>{
        message({
            recipient: "cart",
            type: "open",
        });
    }

    connectedCallback(){
        this.addEventListener("click", this.openCart);
    }
}