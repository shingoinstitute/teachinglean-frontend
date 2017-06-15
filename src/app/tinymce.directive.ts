import { Directive, Input, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Directive({
   selector: '[tinyMce]',
   providers: [NgModel]
})
export class TinyMceDirective implements OnDestroy {
   @Input() height: number;
   @Input() selector;
   @Input() editor;

   constructor(private el: ElementRef, private model: NgModel) {}

   ngOnInit() {}

   ngOnDestroy() {
      tinymce.remove(this.editor);
   }

   initTinyMce() {
      if (!this.selector) {
         this.selector = $(this.el.nativeElement).attr('id');
      }

      tinymce.init({
         selector: `#${this.selector}`,
         plugins: ['advlist', 'autolink', 'lists', 'link', 'searchreplace', 'paste'],
         elementpath: false,
         menubar: false,
         height: `${this.height}px` || `300px`,
         toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
         visualblocks_default_state: false,
         skin_url: '../assets/skins/lightgray',
         setup: editor => {
            this.editor = editor;
            this.editor.on('keyup', () => {
               // Inform ngModel of udpates
               this.model.update.next(this.editor.getContent());
            });
            this.editor.on('change', () => {
               // Inform ngModel of udpates for actions not detected by the 'keyup' event (such as clicking the `underline` button)
               this.model.update.next(this.editor.getContent());
            });
            this.editor.on('init', () => {
               // Set initial value of textarea
               editor.setContent(this.model.value);
            });
         }
      });
   }
}