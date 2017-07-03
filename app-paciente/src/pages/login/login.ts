import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthProvider } from '../../providers/auth/auth';

import { MenuPage } from '../menu/menu';
import { CadastroPage } from './../cadastro/cadastro';

import { EmailValidator } from '../../validators/email';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;
  private loading: Loading;
  private pacientes;

  constructor(
    public navCtrl: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      senha: ['', Validators.compose([Validators.minLength(6), Validators.required])]
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

  public loginUser(){
    if (!this.loginForm.valid){
      console.warn('Formulário de login inválido', this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.senha)
      .then( authRes => {
        this.pacientes = this.db.list('/pacientes', {
          query: {
            orderByChild: 'email',
            equalTo: authRes.email
          }
        });

        this.pacientes = this.pacientes.subscribe(res => {
          console.log(res);
          if(res.length === 0) {
            console.warn('Você não tem permissão para acessar este recurso');
            this.alertError('Você não tem permissão para acessar este recurso');
            this.logout();
          } else {
            this.navCtrl.setRoot(MenuPage);
          }
          this.pacientes.unsubscribe();
        });
      }, error => {
        this.loading.dismiss().then( () => {
          this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          }).present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  /**
   * Desloga o usuário
   * @return {void}
   */
  public logout(): void {
    this.authData.logoutUser()
    .then(res => {
      this.navCtrl.push(LoginPage);
    }, error => {
      console.error('Falha ao deslogar', error);
      this.alertError('Falha ao deslogar');
    });

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }


  public irCadastro(): void {
    this.navCtrl.push(CadastroPage);
  }

}
