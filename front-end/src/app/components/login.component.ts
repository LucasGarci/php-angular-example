import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import * as shajs from 'sha.js';
import { debug } from 'util';
import { AppComponent } from '../app.component';

@Component({
	selector: '',
	templateUrl: '../views/login.html',
	providers: [UsuarioService]
})

export class LoginComponent {

	public usuario: Usuario;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _usuarioService: UsuarioService,
	) { }

	ngOnInit() {
		if (localStorage.getItem("rolSesion") == "user" || localStorage.getItem("rolSesion") == "admin") {
			this._router.navigate(['/anuncios']);
		}
		console.log('usuarios.component.ts cargado');
		this.usuario = new Usuario('', '', '', '', '', 'user', 'resources/user.png');
	}

	onSubmit() {
		this._usuarioService.getUsuario(this.usuario.mail).subscribe(
			result => {
				if (result.code == 200) {
					if (result.data.pass == shajs('sha256').update(this.usuario.pass).digest('hex')) {
						this.usuario = result.data;
						this._router.navigate(['/anuncios']);
						localStorage.setItem("rolSesion", this.usuario.rol);
						console.log("rolSesion: " + localStorage.getItem("rolSesion"));
						localStorage.setItem("usuarioSesion", this.usuario.mail);
						console.log("usuarioSesion: " + localStorage.getItem("usuarioSesion"));
					} else {
						this._router.navigate(['']);
					}
				} else {
					console.log(result);
					this._router.navigate(['']);
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	onSaveUser(){
		this.saveUsuario();
	}

	salir() {
		localStorage.clear();
		this._router.navigate(['']);
		this._router.navigate([window.location.reload()]);
	  }

	saveUsuario() {
		this._usuarioService.addUsuario(this.usuario).subscribe(
			response => {
				console.log(response);
				if (response.code == 200) {
					this._router.navigate(['']);
				} else {
					console.log(response);
				}
			},
			error => {
				this._router.navigate([window.location.reload()]);
				//console.log(<any>error);
			}
		);
	}
}
