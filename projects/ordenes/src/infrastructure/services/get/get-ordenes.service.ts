import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlResources } from 'shared';
import { IPagedOrders } from '../../../domain/model/create-orden.model';

@Injectable({
  providedIn: 'root',
})
export class GetOrdenesService {
  private http = inject(HttpClient);

  execute(page: number = 0, size: number = 5): Observable<IPagedOrders> {
        return this.http.get<IPagedOrders>(urlResources.getOrdenes(page, size));
  }

}
