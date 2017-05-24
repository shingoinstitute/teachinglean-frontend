import { 
	Component,
	Input
 } from '@angular/core';

import { Entry } from './entry';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html'
})
export class EntryComponent {
	@Input('entry') entry: Entry;



}
