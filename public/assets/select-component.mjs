export default class t extends HTMLElement{constructor(){super(),this.handleBlur=()=>{this.validate()},this.handleInput=this.clearError.bind(this),this.select=this.querySelector("select"),this.textEl=this.querySelector("p");const t=document.createElement("p");t.className="error",t.style.display="none",this.insertBefore(t,this.select),this.errorEl=t}validate(){let t=!0;return this.select.required&&""===this.select.value?(t=!1,"invalid"!==this.getAttribute("state")&&this.reportError("This field is required.")):this.clearError(),t}reportError(t){this.errorEl.innerHTML=t,this.errorEl.style.display="block",this.textEl&&(this.textEl.style.display="none"),this.setAttribute("state","invalid")}clearError(){this.errorEl.style.display="none",this.textEl&&(this.textEl.style.display="block"),this.setAttribute("state","valid")}connectedCallback(){this.select.addEventListener("change",this.handleInput),this.select.addEventListener("blur",this.handleBlur)}}