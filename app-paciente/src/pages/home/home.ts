import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

// Providers
import { EstadosMunicipiosProvider } from '../../providers/estados-municipios/estados-municipios';

// Pages
import { ListaMedicosPage } from './../lista-medicos/lista-medicos';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private buscarForm: FormGroup;
  private loading: Loading;
  private listaEspecialidades: any[] = [];
  private listaEstados: any[] = [];
  private listaMunicipios: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public emData: EstadosMunicipiosProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {
    this.buscarForm = formBuilder.group({
      especialidade : ['', Validators.compose([Validators.required])],
      estado        : ['', Validators.compose([Validators.required])],
      cidade        : [{ value: '', disabled: true }, Validators.compose([Validators.required])]
    });

    // inicia spinner de carregamento
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });

    // captura a lista de estados
    emData.getEstados()
    .subscribe(res => {
      this.listaEstados = Object.keys(res);
    });

    // captura a lista de especialidades
    this.db.list('/especialidades')
    .subscribe(res => {
      this.listaEspecialidades = res;
    });
  }

  /**
   * Alert de erro
   * @param {string} message mensagem de erro
   */
  public alertError(message): void {
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
   * Altera a lista de municípios de acordo com o estado
   * @return {void}
   */
  alterarListaMunicipios() {
    this.buscarForm.controls.cidade.disable();
    this.emData.getCidades(this.buscarForm.value.estado)
    .subscribe(res => {
      this.buscarForm.controls.cidade.enable();
      this.listaMunicipios = Object.keys(res);
    });
  }

  /**
   * Redireciona para a lista de médicos com os parâmetros de busca
   * @return {void}
   */
  goToListaMedicos(): void {
    if(!this.buscarForm.valid) {
      this.alertError('É necessário selecionar todos os campos de busca.');
      return;
    }
    this.navCtrl.push(ListaMedicosPage, this.buscarForm.value);
  }
}
