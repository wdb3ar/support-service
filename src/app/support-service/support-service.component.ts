import { Component, OnInit } from '@angular/core';


import { MessageService } from '../message.service';
import { Observable } from 'rxjs';
import { Category } from '../category';

@Component({
  selector: 'app-support-service',
  templateUrl: './support-service.component.html',
  styleUrls: ['./support-service.component.css']
})
export class SupportServiceComponent implements OnInit {

  displayedColumns: string[] = ['summary', 'from', 'date'];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getAndSetData();
  }

  getCategories(): Observable<Category[]> {
    return this.messageService.categories$;
  }

}
