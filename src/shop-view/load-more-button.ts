import { message } from "wwibs";

export class LoadMoreButton extends HTMLElement{
    private loadMore:EventListener = ()=>{
        message({
            recipient: "store",
            type: "load-page",
        });
    }
    connectedCallback(){
        this.addEventListener("click", this.loadMore);
    }
    disconnectedCallback(){
        this.removeEventListener("click", this.loadMore);
    }
}