import { inject, Injectable } from '@angular/core';
import { State } from '../../domain/state';
import { Observable, Subscription, tap } from 'rxjs';
import { GetOrdenesService } from '../../infrastructure/services/get/get-ordenes.service';
import {
  ICreateOrden,
  IPagedOrders,
} from '../../domain/model/create-orden.model';

@Injectable({
  providedIn: 'root',
})
export class GetOrdenesUsecase {
  private readonly _service = inject(GetOrdenesService);
  private readonly _state = inject(State);
  private subscriptions: Subscription;

  //#region Observables
  ordenes$(): Observable<ICreateOrden[]> {
    return this._state.ordenes.ordenes.$();
  }
  getAllordenes$(): Observable<IPagedOrders> {
    return this._state.ordenes.getAllOrdenes.$();
  }
  currentPage$(): Observable<number>{
    return this._state.ordenes.currentPage.$();
  }
  //#endregion

  //#region Public Methods
  initSubscriptions(): void {
    this.subscriptions = new Subscription();
  }

  destroySubscriptions(): void {
    this.subscriptions.unsubscribe();
  }

  execute(page: number = 0, size: number = 5): void {
    this.subscriptions.add(
      this._service
        .execute(page, size)
        .pipe(
          tap((ordenes) => {
           console.log("📌 Órdenes recibidas:", ordenes.content);
        console.log("📌 Página actual desde backend:", ordenes.number);
        console.log("📌 Total páginas:", ordenes.totalPages);

        // ✅ Actualiza `currentPage` y `totalPages` por separado en el estado
        this._state.ordenes.currentPage.set(ordenes.number ?? 0);
        this._state.ordenes.totalPages.set(ordenes.totalPages ?? Math.ceil(ordenes.totalElements / size));

        this._state.ordenes.getAllOrdenes.set({
          content: ordenes.content ?? [],
          totalElements: ordenes.totalElements ?? ordenes.content.length ?? 0,
          size: ordenes.size ?? size,
          number: ordenes.number ?? 0, // No actualizar `number` con `set()`, ya lo estamos haciendo arriba
          totalPages: ordenes.totalPages ?? Math.ceil(ordenes.totalElements / size) // No usar `set()` aquí
        });

        console.log("📌 Estado actualizado:");
        console.log("➡ Página actual:", this._state.ordenes.currentPage.snapshot());
        console.log("➡ Total páginas:", this._state.ordenes.totalPages.snapshot());
        console.log("➡ Órdenes guardadas:", this._state.ordenes.getAllOrdenes.snapshot());
      })

        )
        .subscribe()
    );
  }

  //#endregion

  //#region Private Methods
  //#endregion
}
