import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {UserReactionService} from '../../services/user-reaction.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'user-reaction',
  templateUrl: './user-reaction.component.html',
  styleUrls: ['./user-reaction.component.scss'],
})
export class UserReactionComponent implements OnInit, OnDestroy {
  @Input() postID: string;
  val = 'true';

  reactionCount: any;
  userReaction: any;

  subscription: Subscription;

  constructor(private userReactionService: UserReactionService) { }

  ngOnInit() {
    this.subscription = this.userReactionService.getReactions(this.postID).valueChanges()
        .subscribe(reactions => {
          this.reactionCount = this.userReactionService.countReactions(reactions);
          this.userReaction  = this.userReactionService.userReaction(reactions);

        });
  }

  react(val) {
    if (this.userReaction === val) {
      this.userReactionService.removeReaction(this.postID);
    } else {
      this.userReactionService.updateReaction(this.postID, val);
    }
  }


  hasReactions(index) {
    return _.get(this.reactionCount, index.toString());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
