import {Component, Input, OnInit} from '@angular/core';
import {PostModel} from '../../interfaces/post-model';

@Component({
  selector: 'app-post-feed-view',
  templateUrl: './post-feed-view.component.html',
  styleUrls: ['./post-feed-view.component.scss'],
})
export class PostFeedViewComponent implements OnInit {
  @Input() userPost: PostModel;

  constructor() { }

  ngOnInit() {}

}
