import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  data: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams
        .subscribe(params => {
          console.log(params);
          if (params && params.special) {
            this.data = JSON.parse(params.special);
            console.log(this.data);
          }
        });
  }

  ngOnInit() {
  }

}
