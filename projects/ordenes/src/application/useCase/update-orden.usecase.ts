import { inject, Injectable } from '@angular/core';
import { State } from '../../domain/state';
import { Observable, Subscription, tap } from 'rxjs';
import { ModalComponent } from 'shared';
import { UpdateOrdenService } from '../../infrastructure/services/update/update-orden.service';
import { ICreateOrden } from '../../domain/model/create-orden.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateOrdenUseCase {
  private readonly _service = inject(UpdateOrdenService);
  private readonly _state = inject(State);
  private subscriptions: Subscription;

  //#region Observables
  currentOrden$(): Observable<ICreateOrden> {
    return this._state.ordenes.currentOrdenes.$();
  }
  clearCurrentOrden$(): void {
  this._state.ordenes.currentOrdenes.set(null);
  }
  successMessage$(): Observable<string | null> {
    return this._state.ordenes.successMessage.$();
  }
  //#region Public Methods
  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }
  execute(orden: ICreateOrden, modal: ModalComponent): void {
    this.subscriptions.add(
      this._service
        .updateOrden(orden)
        .pipe(
          tap((updatedOrden) => {
            this._state.ordenes.getAllOrdenes.set({
          ...this._state.ordenes.getAllOrdenes.snapshot(),
          content: this._state.ordenes.getAllOrdenes
            .snapshot()
            .content.map(o => (o.id === updatedOrden.id ? updatedOrden : o)),
        });
            this._state.ordenes.successMessage.set(
              '¡Orden actualizada con éxito!'
            );

            setTimeout(() => {
              modal.toggle();
              this._state.ordenes.currentOrdenes.set(null);
              this._state.ordenes.successMessage.set('');
            }, 1000);
          })
        )
        .subscribe()
    );
  }
  selectOrden(id: number): void {
    const currentOrden = this._state.ordenes.getAllOrdenes
    .snapshot()
    .content.find((orden) => orden.id === id);

  this._state.ordenes.currentOrdenes.set(currentOrden);
  console.log("📌 Orden seleccionada:", this._state.ordenes.currentOrdenes.snapshot())
  }

  //#endregion

  //#region Private Methods
  //#endregion
}
