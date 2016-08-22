import {bindable, bindingMode, inject} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';

@inject(DOM.Element)
export class FluidList {
  
  // array of values and locked; both can be set by an attribute
  // @bindable necessary for it to load
  @bindable({defaultBindingMode: bindingMode.twoWay})
    public values:string[] = [];
  @bindable({defaultBindingMode: bindingMode.twoWay})
    public locked:boolean = false;

  // important members
  private childElem:HTMLElement;
  //private container:HTMLElement;
  private children:HTMLElement[];
  private toDrag:HTMLElement;
  private y:number = 0;

  // constructor function
  constructor(private container:HTMLElement) {
    // setTimeout() necessary because it adds the code to end of "queue"
    // otherwise `this.childElem` and `this.container` would be undefined
    setTimeout(() => {
      this.container.style.height = this.container.clientHeight + "px";
      this.getChildren();
      for(let elem of this.children) {
        let thisContext = this;
        let dragHandler = function(event: MouseEvent):void {
          if(event.target != this.children[0] || (thisContext.toDrag && thisContext.toDrag != this) || thisContext.locked) return;
          if(!thisContext.toDrag) {
            this.classList.add("dragged");
            thisContext.toDrag = this;
            if(this.nextElementSibling)
              this.nextElementSibling.style.marginTop = thisContext.toDrag.clientHeight + "px";
          } else {
            for(let elem of thisContext.children)
              elem.style.marginTop = "0";
            let nearest = thisContext.getNearest();
            thisContext.container.insertBefore(this, thisContext.children[nearest] || null);
            thisContext.toDrag = null;
            this.classList.remove("dragged");
            this.style.top = "auto";
          } 
        };
        elem.addEventListener("mousedown", dragHandler);
        elem.addEventListener("mouseup", dragHandler);
      }
    }, 0);
    // add drag event listener to body
    document.body.addEventListener("mousemove", (event:MouseEvent):void => {
      if(!this.toDrag || this.locked) return;
      this.y = event.pageY;
      this.toDrag.style.top = this.getYCoor()-10 + "px";
      for(let elem of this.getChildren())
        elem.style.marginTop = "0";
      let nearest = this.getNearest();
      if(this.children[nearest] == this.toDrag && this.children.indexOf(this.toDrag) != this.children.length-1)
        this.children[nearest+1].style.marginTop = this.toDrag.clientHeight + "px";
      else if(nearest >= 0 && nearest < this.children.length && nearest != this.children.indexOf(this.toDrag))
        this.children[nearest].style.marginTop = this.toDrag.clientHeight + "px";
    });
    document.body.addEventListener("mouseup", (event:MouseEvent):void => {
      if(this.toDrag && Array.from(document.getElementsByClassName("handle")).indexOf(event.target as HTMLElement) == -1)
        this.toDrag.children[0].dispatchEvent(new Event("mouseup", { bubbles: true }));
    });
  }

  // public functions (retrieve, set, lock)
  public getValues():string[] {
    return this.values;
  }
  public setValues(input:string[]):void {
    this.values = input;
  }
  public lock():void {
    if(this.locked) return;
    this.container.classList.add("locked");
    this.locked = true;
  }
  public unlock():void {
    if(!this.locked) return;
    this.container.classList.remove("locked");
    this.locked = false;
  }
  public lockToggle():void {
    this.container.classList.toggle("locked");
    this.locked = !this.locked;
  }

  // other functions
  private getChildren():HTMLElement[] {
    return (this.children = (Array.from(this.container.children) as HTMLElement[]));
  }
  private getOffsetTop(elem:HTMLElement):number {
    let offset:number = 0;
    do {
      offset += elem.offsetTop;
    } while(elem = (elem.offsetParent as HTMLElement));
    return offset;
  }
  private getNearest():number {
    return Math.round((this.y - this.getOffsetTop(this.container)) / this.container.clientHeight * this.values.length);
  }
  private getYCoor():number {
    return this.y < this.getOffsetTop(this.container) ? 0 : this.y > this.getOffsetTop(this.container) + this.container.clientHeight ? this.container.clientHeight : this.y - this.getOffsetTop(this.container);
  }
  
}
