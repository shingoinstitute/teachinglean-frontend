import { Directive, OnInit, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
   selector: '[md-margin]'
})
export class MdMarginDirective implements OnInit {
   @Input('md-margin') type: string;

   constructor(private el: ElementRef, private renderer: Renderer) {}

   ngOnInit() {
      if (this.type === 'right') {
         this.renderer.setElementStyle(this.el.nativeElement, 'margin-right', '8px');
      } else if (this.type === 'left') {
         this.renderer.setElementStyle(this.el.nativeElement, 'margin-left', '8px');
      } else if (this.type === 'top') {
         this.renderer.setElementStyle(this.el.nativeElement, 'margin-top', '8px');
      } else if (this.type === 'bottom') {
         this.renderer.setElementStyle(this.el.nativeElement, 'margin-bottom', '8px');
      } else {
         this.renderer.setElementStyle(this.el.nativeElement, 'margin', '8px');
      }
   }

}
