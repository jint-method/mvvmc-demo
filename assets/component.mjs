export class Component extends HTMLElement {
    constructor() {
        super();
    }
    setState(state) {
        this.state = Object.assign(this.state, state);
        this.render();
    }
    render() { }
    connected() { }
    disconnected() { }
    updated() { }
    connectedCallback() {
        this.connected();
    }
    disconnectedCallback() {
        this.disconnected();
    }
}
