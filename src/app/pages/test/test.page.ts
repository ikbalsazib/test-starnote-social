import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TestService} from '../../services/test.service';
import {IonInfiniteScroll} from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: true}) infinite: IonInfiniteScroll;
  offset = 0;
  pokemon = [];



  constructor(private pokeService: TestService) {
  }



  ngOnInit() {
    this.loadPokemon();
  }


  loadPokemon(loadMore = false, event?) {
    if (loadMore) {
      this.offset += 25;
    }

    this.pokeService.getPokemon(this.offset)
        .subscribe(res => {
          this.pokemon = [...this.pokemon, ...res];

          if (event) {
            event.target.complete();
          }
        });
  }

  loadPokemons($event: CustomEvent) {
    console.log('Scrooling....')
  }
}
