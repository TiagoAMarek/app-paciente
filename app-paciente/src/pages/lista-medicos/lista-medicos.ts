import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-lista-medicos',
  templateUrl: 'lista-medicos.html',
})
export class ListaMedicosPage implements OnInit {
  public medicos;
  public loading: Loading;
  public data: any = {};
  public lista: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {
    this.data = navParams.data;
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
  }

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaMedicosPage');
  }

}
