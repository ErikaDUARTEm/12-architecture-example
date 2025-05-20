import { inject, Injectable } from '@angular/core';
import { StateFactory } from 'shared';
import { BehaviorSubject } from 'rxjs';
import { ICreateOrden, IPagedOrders } from '../model/create-orden.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenState {
  private readonly _factory = inject(StateFactory);

  //#region Subjectsi
  private readonly ordenes$ = new BehaviorSubject<ICreateOrden[]>([]);
  private readonly currentOrdenes$ = new BehaviorSubject<ICreateOrden>(null);
  private readonly successMessage$ = new BehaviorSubject<string | null>(null);
  private readonly statusOrden$ = new BehaviorSubject<string>(null);
  private readonly getAllOrdenes$ =  new BehaviorSubject<IPagedOrders>(
    {content: [],
    totalElements: 0,
    size: 5,
    pageNumber: 0,
    totalPages: 0,

});
  private readonly currentPage$ = new BehaviorSubject<number>(0);
  private readonly totalPages$ = new BehaviorSubject<number>(1);


  //#endregion

  store() {
    return {
      ordenes: this._factory.state(this.ordenes$),
      currentOrdenes: this._factory.state(this.currentOrdenes$),
      successMessage: this._factory.state(this.successMessage$),
      statusOrden: this._factory.state(this.statusOrden$),
      getAllOrdenes: this._factory.state(this.getAllOrdenes$),
      currentPage: this._factory.state(this.currentPage$),
      totalPages: this._factory.state(this.totalPages$)
    };
  }
  setSuccessMessage(message: string | null) {
    this.successMessage$.next(message);
  }
}
