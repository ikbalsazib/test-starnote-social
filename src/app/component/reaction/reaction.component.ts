import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {ReactionService} from '../../services/reaction.service';

@Component({
  selector: 'reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss'],
})
export class ReactionComponent implements OnInit, OnDestroy {
  @Input() itemId: string;

  showEmojis = false;
  emojiList: string[];

  reactionCount: any;
  userReaction: any;

  subscription: any;

  constructor(private reactionSvc: ReactionService) { }

  ngOnInit() {
    this.emojiList = this.reactionSvc.emojiList;

    this.subscription = this.reactionSvc.getReactions(this.itemId).valueChanges()
        .subscribe(reactions => {

          this.reactionCount = this.reactionSvc.countReactions(reactions);
          this.userReaction  = this.reactionSvc.userReaction(reactions);

        });
  }

  react(val) {
    if (this.userReaction === val) {
      this.reactionSvc.removeReaction(this.itemId);
    } else {
      this.reactionSvc.updateReaction(this.itemId, val);
    }
  }

  toggleShow(b: boolean) {
    this.showEmojis = !this.showEmojis;
  }


  emojiPath(emoji) {
    return `../../../assets/reactions/${emoji}.svg`;
  }

  hasReactions(index) {
    return _.get(this.reactionCount, index.toString());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
