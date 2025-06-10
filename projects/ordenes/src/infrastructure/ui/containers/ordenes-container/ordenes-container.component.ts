import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetOrdenesComponent } from '../../components/get-ordenes/get-ordenes.component';
import { GetOrdenesUsecase } from '../../../../application/useCase/get-ordenes.usecase';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CreateOrdenUsecase } from '../../../../application/useCase/create-orden.usecase';
import {
  ICreateOrden,
  IPagedOrders,
} from '../../../../domain/model/create-orden.model';
import { ModalComponent } from 'shared';
import { UpdateOrdenUseCase } from '../../../../application/useCase/update-orden.usecase';
import { DeleteOrdenUsecase } from '../../../../application/useCase/delete-orden.usecase';
import { UpdateStatusOrdenUseCase } from '../../../../application/useCase/update-status-orden.usecase';
import { OrdenState } from '../../../../domain/state/orden.state';

@Component({
  selector: 'lib-ordenes-container',
  imports: [GetOrdenesComponent, AsyncPipe],
  templateUrl: './ordenes-container.component.html',
})
export class OrdenesContainerComponent implements OnInit, OnDestroy {
  private readonly _getUseCase = inject(GetOrdenesUsecase);
  private readonly _createOrdenUseCase = inject(CreateOrdenUsecase);
  private readonly _updateOrdenUseCase = inject(UpdateOrdenUseCase);
  private readonly _deleteOrdenUseCase = inject(DeleteOrdenUsecase);
  private readonly _updateStatusOrdenUseCase = inject(UpdateStatusOrdenUseCase);
  private readonly ordenState = inject(OrdenState);

  public ordenes$: Observable<ICreateOrden[]>;
  public currentOrden$: Observable<ICreateOrden>;
  public statusOrden$: Observable<string>;
  public getAllOrdens$: Observable<IPagedOrders>;
  public currentPage$ = this._getUseCase.currentPage$();
  public totalPages$ = this._getUseCase.totalPages$();

  ngOnInit(): void {
    this._getUseCase.initSubscriptions();
    this.ordenes$ = this._getUseCase.ordenes$();
    this._createOrdenUseCase.initSubscriptions();
    this._updateOrdenUseCase.initSubscriptions();
    this.currentOrden$ = this._updateOrdenUseCase.currentOrden$();
    this._deleteOrdenUseCase.initSubscriptions();
    this._updateStatusOrdenUseCase.initSubscriptions();
    this.statusOrden$ = this._updateStatusOrdenUseCase.statusOrden$();
    this.getAllOrdens$ = this._getUseCase.ordenesCombinadas$();
    this.handleGetAllOrdens(this.ordenState.store().currentPage.snapshot(), 5);
  }
  handlePatchOrden({
    orden,
    modal,
  }: {
    orden: ICreateOrden;
    modal: ModalComponent;
  }) {

    const usecase = orden.id
      ? this._updateOrdenUseCase
      : this._createOrdenUseCase;
    usecase.execute(orden, modal);
  }
  handleSelectOrden(id: number) {
    this._updateOrdenUseCase.selectOrden(id);
  }
  deleteOrden(id: number) {
    this._deleteOrdenUseCase.execute(id);
  }

  getNextStatus(currentStatus: string): string {
    const statusOptions = [
      'PENDING',
      'IN_PREPARATION',
      'COMPLETED',
      'CANCELLED',
      'DELIVERED',
    ];
    const currentIndex = statusOptions.indexOf(currentStatus);
    return statusOptions[(currentIndex + 1) % statusOptions.length];
  }
  handleStatusChange(orden: ICreateOrden): void {
    const nextStatus = this.getNextStatus(orden.statusOrder);
    const updatedOrden = { ...orden, statusOrder: nextStatus };
    this._updateStatusOrdenUseCase.execute(updatedOrden);
  }
  handleGetAllOrdens(page: number, size: number) {
    this._getUseCase.execute(page, size);
  }

  changePage(increment: number): void {
  const newPage = this.ordenState.store().currentPage.snapshot() + increment;

  if (newPage >= 0 && newPage < this.ordenState.store().totalPages.snapshot()) {
    this.ordenState.store().currentPage.set(newPage);
    this.handleGetAllOrdens(newPage, 5);
  }
}
  ngOnDestroy(): void {
    this._getUseCase.destroySubscriptions();
    this._createOrdenUseCase.destroySubscriptions();
    this._updateOrdenUseCase.destroySubscriptions();
    this._deleteOrdenUseCase.destroySubscriptions();
  }
}
