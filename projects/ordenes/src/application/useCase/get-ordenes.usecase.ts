import { inject, Injectable } from '@angular/core';
import { State } from '../../domain/state';
import { combineLatest, map, Observable, Subscription, tap } from 'rxjs';
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
  totalPages$(): Observable<number>{
    return this._state.ordenes.totalPages.$();
  }
  ordenesCombinadas$(): Observable<IPagedOrders> {
    return combineLatest([this.getAllordenes$(), this.ordenes$()]).pipe(
      map(([paginadas, creadas]) => ({
        ...paginadas,
        content: [...paginadas.content, ...creadas]
      }))
    );
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
        this._state.ordenes.currentPage.set(ordenes.pageNumber ?? 0);
        this._state.ordenes.totalPages.set(ordenes.totalPages ?? Math.ceil(ordenes.totalElements / size));
        this._state.ordenes.getAllOrdenes.set({
          content: ordenes.content ?? [],
          totalElements: ordenes.totalElements ?? ordenes.content.length ?? 0,
          size: ordenes.size ?? size,
          pageNumber: ordenes.pageNumber ?? 0,
          totalPages: ordenes.totalPages ?? Math.ceil(ordenes.totalElements / size)
        });
      })
        )
        .subscribe()
    );
  }

  //#endregion

  //#region Private Methods
  //#endregion
}
