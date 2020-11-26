import { message } from "./wwibs.mjs";
export class LoadMoreButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.loadMore = () => {
            message({
                recipient: "store",
                type: "load-page",
            });
        };
    }
    connectedCallback() {
        this.addEventListener("click", this.loadMore);
    }
    disconnectedCallback() {
        this.removeEventListener("click", this.loadMore);
    }
}
