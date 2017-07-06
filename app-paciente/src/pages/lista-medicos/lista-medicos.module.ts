import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaMedicosPage } from './lista-medicos';
import { ModalSolicitacao } from './modal-solicitacao';

@NgModule({
  declarations: [
    ListaMedicosPage,
    ModalSolicitacao
  ],
  imports: [
    IonicPageModule.forChild([ListaMedicosPage, ModalSolicitacao]),
  ],
  exports: [
    ListaMedicosPage,
    ModalSolicitacao
  ]
})
export class ListaMedicosPageModule {}
