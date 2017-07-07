import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

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
      <form [formGroup]="agendamentoForm">
        <ion-list>
          <ion-item>
            <ion-label color="primary">Descreva seus sintomas:</ion-label>
            <ion-textarea formControlName="mensagem"></ion-textarea>
          </ion-item>
        </ion-list>
      </form>
      <div padding>
        <button ion-button block (click)="solicitarAgendamento()">Solicitar agendamento</button>
      </div>
    </ion-content>
  `,
})
export class ModalSolicitacao {
  private agendamentoForm: FormGroup;
  private loading: Loading;
  private uid;
  private agenda;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {
    this.agendamentoForm = this.formBuilder.group({
      mensagem: this.formBuilder.control('', Validators.required)
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.uid = params.get('docId');
    this.agenda = this.db.list('/agenda');
 }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * Alert de erro
   * @param {string} message mensagem de erro
   */
  public showAlert(message): void {
    this.loading.dismiss().then( () => {
      this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      }).present();
    });
  }

  /**
   * Faz o envio da solicitação de agendamento
   */
  solicitarAgendamento(): void {
    if(!this.agendamentoForm.valid) {
      this.showAlert('Preencha todos os campos');
      return;
    }
    this.agenda.push({
      mensagem : this.agendamentoForm.value.mensagem,
      uid      : this.uid
    }).then(() => {
      this.showAlert('Solicitação enviada');
      this.closeModal();
    });
  }
}
