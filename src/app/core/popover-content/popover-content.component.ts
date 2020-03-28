import { Component, OnInit } from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html',
  styleUrls: ['./popover-content.component.scss'],
})
export class PopoverContentComponent implements OnInit {

  constructor(private userAuthService: UserAuthService) { }

  ngOnInit() {}

    onLogout() {
        this.userAuthService.SignOut();
    }
}
