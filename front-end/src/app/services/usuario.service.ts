import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../models/usuario';
import { GLOBAL } from './global';

@Injectable()

export class UsuarioService {
	public url: string;

	constructor(
		public _http: Http
	) {
		this.url = GLOBAL.url;
	}

	getUsuarios() {
		return this._http.get(this.url + 'usuarios').map(res => res.json());
	}

	addUsuario(usuario: Usuario) {
		let json = JSON.stringify(usuario);
		console.log(json);
		let params = 'json=' + json;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post(this.url + 'usuarios', params, { headers: headers })
			.map(res => res.json());

	}

	editUsuario(id, usuario: Usuario) {

		let json = JSON.stringify(usuario);
		let params = "json=" + json;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post(this.url + 'updateUser/' + id, params, { headers: headers }).map(res => res.json());
	}

	deleteUsuario(id) {
		return this._http.get(this.url + 'deleteUser/' + id).map(res => res.json());
	}

	getUsuario(id) {
		return this._http.get(this.url + 'usuario/' + id).map(res => res.json());
	}

	makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
		return new Promise((resolve, reject) => {
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for (var i = 0; i < files.length; i++) {
				formData.append('uploads[]', files[i], files[i].name);
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			};
			xhr.open("POST", url, true);
			xhr.send(formData);
		});
	}
}
