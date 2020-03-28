import { Component, OnInit } from '@angular/core';
import {TestService} from '../../services/test.service';
import {BookModel} from '../../interfaces/book-model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  bookObservable: Observable<BookModel[]>;

  book1: BookModel = {
    title: 'Humanity',
    author: 'Ikbal',
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, reprehenderit?'
  };

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.bookObservable = this.testService.findBooks().valueChanges();
  }

  addNewItem() {
    const slug = this.book1.title.replace(/\s+/g, '-').toLowerCase();
    this.testService.createBook(this.book1, slug);
  }

  updateItem() {
    this.testService.updateBook('Title Changed', 'my-new-book');
  }

  removeItem() {
    this.testService.deleteBook('my-new-book');
  }
}
