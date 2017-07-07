import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ModalSolicitacao } from './modal-solicitacao';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-lista-medicos',
  templateUrl: 'lista-medicos.html',
})
export class ListaMedicosPage implements OnInit {
  public medicos;
  public agenda;
  public loading: Loading;
  public data: any = {};
  public lista: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public db: AngularFireDatabase
  ) {
    this.data = navParams.data;
    this.agenda = this.db.list('/agenda');
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
  }

  /**
   * Busca os médicos de acordo com a busca do usuário
   * @return {void}
   */
  ngOnInit(): void {
    this.medicos = this.db.list('/medicos', {
      query: {
        orderByChild: 'cidade',
        equalTo: this.data.cidade.toUpperCase()
      }
    });
    this.medicos.subscribe(medicos => {
      this.lista = medicos.filter(medico => {
        return medico['estado'] === this.data.estado && medico['especialidade'] === this.data.especialidade.toUpperCase();
      });
    });
    this.loading.present();
  }

  abrirSolicitacao(data): void {
    let modalSolitacao = this.modalCtrl.create(ModalSolicitacao, {
      docId: data.uid,
      nome: data.nome,
      email: data.email
    });

    modalSolitacao.present();
  }
}
