import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-background',
  templateUrl: './text-background.component.html',
  styleUrls: ['./text-background.component.scss'],
})
export class TextBackgroundComponent implements OnInit {
  @Input() textOnly: string;

  constructor() { }

  ngOnInit() {}

}
