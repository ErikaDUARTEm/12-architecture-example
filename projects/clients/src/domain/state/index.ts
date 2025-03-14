import { inject, Injectable } from "@angular/core";
import { ClientsState} from "./clients.state";

@Injectable({
  providedIn: 'root'
})
export class State {
  private readonly _clients = inject(ClientsState);

  get clients() {
    return this._clients.store();
  }
}
