import { updateLineItemQuantity } from "../../controllers/cart";

export class LineItem extends HTMLElement{
    private addButton: HTMLButtonElement;
    private subtractButton: HTMLButtonElement;
    private input: HTMLInputElement;

    constructor(){
        super();
        this.addButton = this.querySelector(".js-add");
        this.subtractButton = this.querySelector(".js-subtract");
    }

    private add:EventListener = ()=>{
        let value = parseInt(this.dataset.qty);
        value++;
        if (value > 999){
            value = 999;
        }
        updateLineItemQuantity(this.dataset.id, value);
    }

    private subtract:EventListener = ()=>{
        let value = parseInt(this.dataset.qty);
        value--;
        if (value < 1){
            value = 1;
        }
        updateLineItemQuantity(this.dataset.id, value);
    }

    connectedCallback(){
        this.addButton.addEventListener("click", this.add);
        this.subtractButton.addEventListener("click", this.subtract);
    }
}