import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-solicitacao',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Solicitar agendamento</ion-title>
        <ion-buttons end>
          <button ion-button icon-only (click)="closeModal()">
            Fechar
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h1>Oi</h1>
    </ion-content>
  `,
})
export class ModalSolicitacao {

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log('UserId', params.get('userId'));
 }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
