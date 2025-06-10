import { inject, Injectable } from '@angular/core';

import {
  Observable,
  Subscription,
  tap,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { GetMenuService } from '../infrastructure/services/get/get-menu.service';
import { State } from '../domain/state';
import {
  IAddMenuResponse,
  IDish,
  IRestaurant,
} from '../domain/model/menu.model';
import { AddDishUsecase } from './add-dish.usecase';

@Injectable({
  providedIn: 'root',
})
export class GetMenuUseCase {
  private readonly _service = inject(GetMenuService);
  private readonly _state = inject(State);
  private readonly _addDishUseCase = inject(AddDishUsecase);
  private subscriptions: Subscription;

  //#region Observables
  restaurant$(): Observable<IRestaurant> {
    return this._state.menu.restaurant.$();
  }
  menu$(): Observable<IAddMenuResponse> {
    return this._state.menu.menu.$();
  }
  successMessage$(): Observable<string | null> {
    return this._state.menu.successMessage.$();
  }
  currentPage$(): Observable<number> {
    return this._state.menu.currentPage.$();
  }

  itemsPerPage$(): Observable<number> {
    return this._state.menu.itemsPerPage.$();
  }
  totalPages$(): Observable<number> {
  return this._state.menu.dishes.$().pipe(
    withLatestFrom(this.itemsPerPage$()),
    map(([dishes, itemsPerPage]) => Math.ceil((dishes?.length ?? 0) / itemsPerPage))
  );
}
  dishes$(): Observable<IDish[]> {
    return this._addDishUseCase
      .currentDishes$()
      .pipe(
        switchMap((dishes) =>
          this._state.menu.currentPage
            .$()
            .pipe(
              map(
                (currentPage) =>
                  dishes?.slice((currentPage - 1) * 5, currentPage * 5) || []
              )
            )
        )
      );
  }

  //#endregion

  //#region Public Methods
  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  execute(restaurantId: number): void {
    this.subscriptions.add(
      this._service
        .execute(restaurantId)
        .pipe(
          tap((restaurant: IRestaurant) => {
            this._state.menu.restaurant.set(restaurant);
            this._state.menu.menu.set(restaurant.menuRestaurant);
            this._state.menu.dishes.set(restaurant.menuRestaurant.dishes);
          }),
          withLatestFrom(
            this._state.menu.currentPage.$(),
            this._state.menu.itemsPerPage.$()
          ),
          tap(([_, currentPage, itemsPerPage]) => {
            const dishesPaginated = this._state.menu.dishes
              .snapshot()
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              );
            this._state.menu.currentDishes.set(dishesPaginated);
            console.log(dishesPaginated);
          })
        )
        .subscribe()
    );
  }

  changePage(page: number): void {
    this._state.menu.currentPage.set(page);
  }

  changeItemsPerPage(count: number): void {
    this._state.menu.itemsPerPage.set(count);
  }
  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }
}
