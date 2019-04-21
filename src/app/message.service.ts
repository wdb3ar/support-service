import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map, mergeMap, find, first } from 'rxjs/operators';

import { Category } from './category';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private categories$ = new BehaviorSubject<Category[]>([]);
  private messages$ = new BehaviorSubject<Message[]>([]);

  constructor(private http: HttpClient) { }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      if (error.status === 0) {
        alert('Server not found');
      }
      return of(result as T);
    };
  }

  public getAndSetData(): void {
    this.http.get<{ categories: Category[], messages: Message[] }>(`${environment.apiUrl}/db`)
      .pipe(
        catchError(this.handleError<{ categories: Category[], messages: Message[] }>({ categories: [], messages: [] }))
      ).subscribe(data => {
        this.categories$.next(data.categories);
        this.messages$.next(data.messages);
      });
  }

  private updateMessage(message: Message): Observable<Message> {
    return this.http.put<Message>(`${environment.apiUrl}/messages/${message.id}`, message)
      .pipe(
        catchError(this.handleError<Message>())
      );
  }

  public setMessageCategory(idMessage: number, idCategory: number): void {
    this.categories$.pipe(
      mergeMap(categories => categories),
      find(category => category.id === idCategory)
    ).subscribe(() => {
      this.messages$.pipe(
        first()
      ).subscribe(messages => {
        const messageIndex = messages.findIndex(item => item.id == idMessage);
        if (messageIndex >= 0) {
          const message = messages[messageIndex];
          message.categoryId = idCategory;
          message.sortDate = new Date().toJSON();
          this.updateMessage(message).subscribe(message => {
            messages[messageIndex] = message;
            this.messages$.next(messages);
          });
        }
      });
    });
  }

  private compareDates(a: any, b: any): number {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  private compareSortDates(a: any, b: any): number {
    return new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime();
  }

  public getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  public getMessagesByCategoryId(id: number): Observable<Message[]> {
    return this.messages$.pipe(
      map((messages: Message[]) => {
        const filteredMessages = messages.filter(message => message.categoryId === id);
        if (id) {
          return filteredMessages.sort(this.compareSortDates);
        }
        return filteredMessages.sort(this.compareDates);
      })
    );
  }
}
