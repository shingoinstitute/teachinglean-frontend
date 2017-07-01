import { Directive, OnInit, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
   selector: '[md-margin]'
})
export class MdMarginDirective implements OnInit {
   @Input('md-margin') type: any = "";

   constructor(private el: ElementRef, private renderer: Renderer) {}

   ngOnInit() {
      /** You can pass an array as the argument to include multi sided margins
       * Follows the pattern `side name, value[, side name, value]`
       * Example: `<div md-margin="[top, 8, left, 12, bottom, 8]"></div>`
       */
      if (this.type.includes('[') && this.type.includes(']')) {
         var attrs = this.type.toString() .replace(/\'/g, '\"');
         this.addAttributes(JSON.parse(attrs));
      } else if (typeof this.type === 'string') {
         this.addMargin(this.type, 8);
      } else if (typeof this.type === 'number') {
         this.addMargin('all', this.type);
      } else {
         this.addMargin('all', 8);
      }
   }

   private addAttributes(attrs: any[]) {
      var value;
      var type;
      for (const attr of attrs) {
         if (typeof attr === 'string') {
            type = attr;
         } else if (typeof attr === 'number') {
            value = attr;
         }
         if (type && value) {
            this.addMargin(type, value);
            type = undefined;
            value = undefined;
         }
      }
      if (type) {
         this.addMargin(type, 8);
      }
   }

   addMargin(type: string, value: number) {
      if (type === 'right') {
         this.addRight(value);
      } else if (type === 'left') {
         this.addLeft(value);
      } else if (type === 'top') {
         this.addTop(value);
      } else if (type === 'bottom') {
         this.addBottom(value);
      } else {
         this.addAll(value);
      }
   }

   private addAll(value: number) {
      this.renderer.setElementStyle(this.el.nativeElement, 'margin', `${value}px`);
   }

   private addRight(value: number) {
      this.renderer.setElementStyle(this.el.nativeElement, 'margin-right', `${value}px`);
   }

   private addLeft(value: number) {
      this.renderer.setElementStyle(this.el.nativeElement, 'margin-left', `${value}px`);
   }

   private addTop(value: number) {
      this.renderer.setElementStyle(this.el.nativeElement, 'margin-top', `${value}px`);
   }

   private addBottom(value: number) {
      this.renderer.setElementStyle(this.el.nativeElement, 'margin-bottom', `${value}px`);
   }

}
