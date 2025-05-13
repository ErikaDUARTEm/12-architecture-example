import { inject, Injectable } from '@angular/core';
import { State } from '../../domain/state';
import { Observable, Subscription, tap } from 'rxjs';
import { DeleteOrdenService } from '../../infrastructure/services/delete/delete-orden.service';
import { ICreateOrden } from '../../domain/model/create-orden.model';

@Injectable({
  providedIn: 'root',
})
export class DeleteOrdenUsecase {
  private readonly _service = inject(DeleteOrdenService);
  private readonly _state = inject(State);
  private subscriptions: Subscription = new Subscription();

  //#region Observables
  currentOrden$(): Observable<ICreateOrden> {
    return this._state.ordenes.currentOrdenes.$();
  }
  //#endregion

  //#region Public Methods
  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }

  execute(id: number): void {
  this.subscriptions.add(
    this._service.deleteOrderById(id).pipe(
      tap(() => {
        console.log("📌 Orden eliminada en backend:", id);

        // ✅ Obtiene el estado actual de `getAllOrdenes`
        const currentState = this._state.ordenes.getAllOrdenes.snapshot();

        // ✅ Filtra la orden eliminada para que no aparezca más en la lista
        const updatedOrders = currentState.content.filter(orden => orden.id !== id);

        // ✅ Actualiza `getAllOrdenes` en el estado global
        this._state.ordenes.getAllOrdenes.set({
          ...currentState,
          content: updatedOrders,
        });

        console.log("📌 Estado actualizado tras eliminación:", this._state.ordenes.getAllOrdenes.snapshot());
      })
    ).subscribe()
  );
}
  selectOrden(id: number): void {
    const currentOrden = this._state.ordenes.ordenes
      .snapshot()
      .find((ordenes) => ordenes.id === id);
    this._state.ordenes.currentOrdenes.set(currentOrden);
  }
  //#endregion

  //#region Private Methods
  //#endregion
}
