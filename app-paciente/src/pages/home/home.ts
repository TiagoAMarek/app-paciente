import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  private listaEspecialidades: any[] = [];
  private listaEstados: any[] = [];
  private listaMunicipios: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public emData: EstadosMunicipiosProvider,
    public formBuilder: FormBuilder,
    public db: AngularFireDatabase
  ) {
    this.buscarForm = formBuilder.group({
      especialidade : ['', Validators.compose([Validators.required])],
      estado        : ['', Validators.compose([Validators.required])],
      cidade        : [{ value: '', disabled: true }, Validators.compose([Validators.required])]
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

  goToListaMedicos() {
    this.navCtrl.push(ListaMedicosPage);
  }
}
