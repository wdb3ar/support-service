import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from '../message';
import { MessageService } from '../message.service';
import { Category } from '../category';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.css']
})
export class MessageTableComponent implements OnInit {

  @Input() category: Category;
  messages$: Observable<Message[]>;

  displayedColumns: string[] = ['summary', 'from', 'date'];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messages$ = this.messageService.getMessagesByCategoryId(this.category ? this.category.id : null);
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer !== event.container) {
      const id = Number(event.item.element.nativeElement.dataset['id']);
      this.messageService.setMessageCategory(id, this.category.id);
    }
  }

  getTitle() {
    if (this.category) {
      return this.category.name;
    }
    return 'Unsorted messages';
  }
}