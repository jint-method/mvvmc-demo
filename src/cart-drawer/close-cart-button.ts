import { message } from "wwibs";

export class CloseCartButton extends HTMLElement{
    private closeCart:EventListener = ()=>{
        message({
            recipient: "cart",
            type: "close",
        });
    }

    connectedCallback(){
        this.addEventListener("click", this.closeCart);
    }
}