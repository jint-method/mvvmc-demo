import { env } from "./env.mjs";
import { minimumConnection, djinnjsOutDir } from "./config.mjs";
export class WebComponentManager {
    constructor() {
        /**
         * When a custom element is observed by the `IntersectionObserver` API unobserve the element and attempt to upgrade the web component.
         * @param entries - an array of `IntersectionObserverEntry` objects
         */
        this.intersectionCallback = (entries) => {
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    const element = entries[i].target;
                    const customElement = element.tagName.toLowerCase().trim();
                    const requiredConnectionType = element.getAttribute("required-connection") || minimumConnection;
                    if (customElements.get(customElement) === undefined) {
                        if (env.checkConnection(requiredConnectionType)) {
                            this.io.unobserve(element);
                            this.upgradeToWebComponent(customElement, element);
                        }
                    }
                    else {
                        this.io.unobserve(element);
                        element.setAttribute("component-state", "mounted");
                    }
                }
            }
        };
        this.io = new IntersectionObserver(this.intersectionCallback);
    }
    removeRequiredConnections() {
        const webComponentElements = Array.from(document.body.querySelectorAll(`[web-component]`));
        for (let i = 0; i < webComponentElements.length; i++) {
            const element = webComponentElements[i];
            element.setAttribute("required-connection", "slow-2g");
        }
    }
    removePurgeableComponents() {
        const webComponentElements = Array.from(document.body.querySelectorAll(`[web-component][removable]`));
        for (let i = 0; i < webComponentElements.length; i++) {
            const element = webComponentElements[i];
            const requiredConnectionType = element.getAttribute("required-connection") || minimumConnection;
            if (customElements.get(element.tagName.toLowerCase().trim()) === undefined) {
                if (!env.checkConnection(requiredConnectionType)) {
                    this.io.unobserve(element);
                    element.remove();
                }
            }
        }
    }
    collectWebComponents() {
        const sessionChoice = sessionStorage.getItem("connection-choice");
        if (sessionChoice === "full") {
            this.removeRequiredConnections();
        }
        else if (sessionChoice === "lite") {
            this.removePurgeableComponents();
        }
        this.handleWebComponents();
    }
    /**
     * Upgrades a custom element into a web component using the dynamic import syntax.
     * @param customElementTagName - the JavaScript filename
     * @param customElement - the `Element` that has been upgraded
     */
    async upgradeToWebComponent(customElementTagName, customElement) {
        if (customElements.get(customElementTagName) === undefined) {
            const ticket = env.startLoading();
            const module = await import(`${location.origin}/${djinnjsOutDir}/${customElementTagName}.mjs`);
            if (customElements.get(customElementTagName) === undefined) {
                customElements.define(customElementTagName, module.default);
            }
            customElement.setAttribute("component-state", "mounted");
            env.stopLoading(ticket);
        }
        else {
            customElement.setAttribute("component-state", "mounted");
        }
    }
    /**
     * Collect all custom elements tagged with a `web-component` attribute that have not already been tracked.
     * If the custom element is tagged with `loading="eager"` upgrade the custom element otherwise track the
     * custom element with the `IntersectionObserver` API.
     */
    handleWebComponents() {
        const customElements = Array.from(document.body.querySelectorAll("[web-component]:not([component-state])"));
        for (let i = 0; i < customElements.length; i++) {
            const element = customElements[i];
            const loadType = element.getAttribute("loading");
            const requiredConnectionType = element.getAttribute("required-connection") || minimumConnection;
            if (loadType === "eager" && env.checkConnection(requiredConnectionType)) {
                const customElement = element.tagName.toLowerCase().trim();
                this.upgradeToWebComponent(customElement, element);
            }
            else {
                element.setAttribute("component-state", "unseen");
                this.io.observe(customElements[i]);
            }
        }
        if (env.connection === "2g" || env.connection === "slow-2g" || env.connection === "3g") {
            if (sessionStorage.getItem("connection-choice") === null) {
                if (!env.dataSaver) {
                    const event = new CustomEvent("djinn:lightweight-check");
                    document.dispatchEvent(event);
                }
                else {
                    sessionStorage.setItem("connection-choice", "lite");
                    this.removePurgeableComponents();
                }
            }
        }
    }
}
