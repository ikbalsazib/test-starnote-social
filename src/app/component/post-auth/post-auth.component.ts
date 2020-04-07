import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserModel} from '../../interfaces/user-model';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'post-auth',
  templateUrl: './post-auth.component.html',
  styleUrls: ['./post-auth.component.scss'],
})
export class PostAuthComponent implements OnInit, OnDestroy {
  @Input() authorID: string;
  @Input() postDate: any;

  private subscription: Subscription;
  user: UserModel;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscription = this.userService.getUserCompleteFieldData(this.authorID).valueChanges()
        .subscribe((data: UserModel) => {
          this.user = data;
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
