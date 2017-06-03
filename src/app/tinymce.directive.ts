import { Directive, Input, Output, EventEmitter, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Directive({
   selector: '[tinyMce]',
   providers: [NgModel]
})
export class TinyMceDirective implements AfterViewChecked {
   @Input() height: number;
   @Input('editor') editor;
   isFocused: boolean = true;
   private _shouldRender: boolean;
   // private viewCheckObserverSource = new Subject<any>();
   private viewCheckObserver$;

   constructor(private el: ElementRef, private model: NgModel) {
      console.log('is focused', this.isFocused);
   }

   ngOnInit() {
      this.viewCheckObserver$ = Observable.of<boolean>(this._shouldRender)
      .distinctUntilChanged(render => this._shouldRender)
      .subscribe((render) => {
         console.log('should render', render);
         this._shouldRender && this.initTinyMce($(this.el.nativeElement).attr('id'));
      });
      
      // Listen to value changes of ngModel
      this.model.valueChanges.subscribe(value => {
         $(this.el.nativeElement).data("newValue", value);
      });

      // Inform ngModel that value changed
      $(this.el.nativeElement).bind("customEvent", newValue => {
         this.model.update.emit(newValue);
         this.editor && this.editor.setContent(this.model.value);
      });
   }

   
   onCheckFocus(didFocus) {
      console.log('didcheckfocus');
      this.isFocused = didFocus;
   }

   ngAfterViewChecked() {
      if (this.isFocused === !this._shouldRender) {
         console.log('isFocused', this.isFocused);
         this._shouldRender = this.isFocused;
         if (!this.isFocused) {
            this.editor && tinymce.remove(this.editor);
            delete this.editor;
         } else {
            this.viewCheckObserver$.next();
         }
      }
   }

   initTinyMce(selector) {
      this.editor && tinymce.remove(this.editor);
      tinymce.init({
         selector: `#${selector}`,
         plugins: ['advlist', 'autolink', 'lists', 'link', 'searchreplace', 'paste'],
         elementpath: false,
         menubar: false,
         height: `${this.height}px` || `300px`,
         toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
         visualblocks_default_state: false,
         skin_url: '../assets/skins/lightgray',
         setup: editor => {
            this.editor = editor;
         },
      });
      this.editor && this.editor.setContent(this.model.value() || "");
   }
}