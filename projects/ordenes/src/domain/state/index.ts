import { inject, Injectable } from '@angular/core';
import { OrdenState } from './orden.state';

@Injectable({
  providedIn: 'root',
})
export class State {
  private readonly _ordenes = inject(OrdenState);
  private readonly _getAllOrdenes = inject(OrdenState);
  private readonly _currentPage = inject(OrdenState);

  get ordenes() {
    return this._ordenes.store();
  }
  getAllOrdenes(){
    return this._getAllOrdenes.store();
  }
  currentPage(){
    return this._currentPage.store();
  }
}
