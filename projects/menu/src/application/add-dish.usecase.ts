import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { ModalComponent } from 'shared';
import { AddDishService } from '../infrastructure/services/post/add-dish.service';
import { IDish } from '../domain/model/menu.model';
import { State } from '../domain/state';

@Injectable({
  providedIn: 'root',
})
export class AddDishUsecase {
  private readonly _service = inject(AddDishService);
  private readonly _state = inject(State);
  private subscriptions: Subscription;

  //#region Observables

  currentDishes$(): Observable<IDish[]> {
    return this._state.menu.dishes.$();
  }
  dishFormReset$(): Observable<boolean> {
    return this._state.menu.dishFormReset.$();
  }
  //#endregion
  //#region Public Methods
  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }
  execute(dish: IDish, modal: ModalComponent): void {
    this.subscriptions.add(
      this._service
        .addDish(dish)
        .pipe(
          tap((dish) => {
            const currentDishes = this._state.menu.dishes.snapshot();
            this._state.menu.dishes.set([...currentDishes, dish]);
            this._state.menu.successMessage.set('¡Plato creado con éxito!');
            this._state.menu.dishFormReset.set(true);
            setTimeout(() => {
              modal.toggle();
              this._state.menu.successMessage.set('');
            }, 2000);
          }),
          catchError((error) => {
            const message =
              typeof error.error === 'string'
                ? error.error
                : error.error?.error || 'Error inesperado al crear el plato';
            this._state.menu.successMessage.set(message);
            this._state.menu.dishFormReset.set(true);

            setTimeout(() => {
              this._state.menu.successMessage.set('');
              this._state.menu.dishFormReset.set(false);
            }, 4000);

            return of();
          })
        )
        .subscribe()
    );
  }

  //#endregion

  //#region Private Methods
  //#endregion
}
