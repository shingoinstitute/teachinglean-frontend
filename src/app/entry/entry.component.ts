import { 
	Component,
	OnInit,
	OnChanges,
	Input
} from '@angular/core';

import { ForumService } from '../services/forum.service';

import { Entry } from './entry';

@Component({
	selector: 'entries',
	templateUrl: './entry.component.html'
})
export class EntryComponent implements OnChanges {
	@Input() entries: Entry[] = [];
	
	@Input() type: string;

	constructor(private forumService: ForumService) { }

	ngOnChanges() {
		this.entries.map(value => {
			this.setTitleIfNone(value);
		});
	}

	getLink(entry: Entry) {
		return entry.parent ? '/forum/' + entry.parent : '/forum/' + entry.id;
	}

	// Set the title of the entry if it does not have one (i.e., comments and answers)
	setTitleIfNone(entry: Entry) {
		if (!entry.title) {
			this.forumService.getEntryParent(entry.id)
			.subscribe(
				data => {
					entry.title = data.parent && data.parent.title ? data.parent.title : "";
				}
			);
		}
	}

	getDescription(entry: Entry) {
		let desc;
		if (this.type === "answer") {
			desc = "You answered this question on ";
		} else if (this.type === "comment") {
			desc = "You commented on this question on ";
		} else {
			desc = "You asked this question on ";
		}
		return desc + entry.createdAtToString();
	}

	

}
