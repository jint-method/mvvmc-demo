export class Component<IComponentState> extends HTMLElement{

    public state: IComponentState;

    constructor(){
        super();
    }

    public setState(state:Partial<IComponentState>){
        this.state = Object.assign(this.state, state);
        this.render();
    }

    public render(){}

    public connected(){}

    public disconnected(){}

    public updated(){}

    connectedCallback(){
        this.connected();
    }
    
    disconnectedCallback(){
        this.disconnected();
    }
}