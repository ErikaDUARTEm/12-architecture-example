import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StateFactory } from 'shared';
import { IAddMenuResponse, IDish, IRestaurant } from '../model/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuState {
  private readonly _factory = inject(StateFactory);

  //#region Subjects
  private readonly restaurant$ = new BehaviorSubject<IRestaurant>(null);
  private readonly menu$ = new BehaviorSubject<IAddMenuResponse>(null);
  private readonly dishes$ = new BehaviorSubject<IDish[]>([]);
  private readonly currentDishes$ = new BehaviorSubject<IDish[]>([]);
  private readonly currentDish$ = new BehaviorSubject<IDish>(null);
  private readonly successMessage$ = new BehaviorSubject<string>(null);
  private readonly currentPage$ = new BehaviorSubject<number>(1);
  private readonly itemsPerPage$ = new BehaviorSubject<number>(5);
  //#endregion

  store() {
    return {
      restaurant: this._factory.state(this.restaurant$),
      menu: this._factory.state(this.menu$),
      dishes: this._factory.state(this.dishes$),
      currentDishes: this._factory.state(this.currentDishes$),
      currentDish$: this._factory.state(this.currentDish$),
      successMessage: this._factory.state(this.successMessage$),
      currentPage: this._factory.state(this.currentPage$),
      itemsPerPage: this._factory.state(this.itemsPerPage$),

    };
  }
  setSuccessMessage(message: string | null) {
    this.successMessage$.next(message);
  }
}
