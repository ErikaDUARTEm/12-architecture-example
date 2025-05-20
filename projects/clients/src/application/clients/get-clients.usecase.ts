import { inject, Injectable } from '@angular/core';
import { State } from '../../domain/state';
import { IClient } from '../../domain/model/client.model';
import { Observable, Subscription, tap } from 'rxjs';
import { GetClientsService } from '../../infrastructure/services/get/get-clients.service';

@Injectable({
  providedIn: 'root',
})
export class GetClientsUsecase {
  private readonly _service = inject(GetClientsService);
  private readonly _state = inject(State);
  private subscriptions: Subscription;

  //#region Observables
  clients$(): Observable<IClient[]> {
    return this._state.clients.clients.$();
  }
  currentPage$(): Observable<number>{
    return this._state.clients.currentPage.$();
  }
  totalPages$(): Observable<number>{
    return this._state.clients.totalPages.$();
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
    this._service.execute(page, size).pipe(
      tap((pagedClients) => {
        this._state.clients.currentPage.set(pagedClients.pageNumber ?? 0);
        this._state.clients.totalPages.set(pagedClients.totalPages ?? Math.ceil(pagedClients.totalElements / size));
        this._state.clients.clients.set(pagedClients.content ?? []);
      })
    ).subscribe()
  );
}
  //#endregion

  //#region Private Methods
  //#endregion
}
