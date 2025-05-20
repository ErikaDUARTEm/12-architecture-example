import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IClient, IPagedClients } from '../../../domain/model/client.model';
import { urlResources } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class GetClientsService {
  private http = inject(HttpClient);

  execute(page: number = 0, size: number = 5): Observable<IPagedClients> {
    return this.http.get<IPagedClients>(urlResources.getClients(page, size));
  }
}
