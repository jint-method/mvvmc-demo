import { removeLineItem, updateLineItemQuantity } from "../../controllers/cart";

export class LineItem extends HTMLElement{
    private addButton: HTMLButtonElement;
    private subtractButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;

    constructor(){
        super();
        this.addButton = this.querySelector(".js-add");
        this.subtractButton = this.querySelector(".js-subtract");
        this.deleteButton = this.querySelector(".js-delete");
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

    private delete:EventListener = ()=>{
        removeLineItem(this.dataset.id);
    }

    connectedCallback(){
        this.addButton.addEventListener("click", this.add);
        this.subtractButton.addEventListener("click", this.subtract);
        this.deleteButton.addEventListener("click", this.delete);
    }
}