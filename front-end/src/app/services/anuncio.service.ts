import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Anuncio } from '../models/anuncio';
import { Comentario } from '../models/comentario';
import { GLOBAL } from './global';

@Injectable()
export class AnuncioService {
	public url: string;

	constructor(
		public _http: Http
	) {
		this.url = GLOBAL.url;
	}

	getAnuncios() {
		return this._http.get(this.url + 'anuncios').map(res => res.json());
	}

	getAnuncio(id) {
		return this._http.get(this.url + 'anuncio/' + id).map(res => res.json());
	}

	getComentariosDe(id) {
		return this._http.get(this.url + 'comentariosde/' + id).map(res => res.json());
	}

	addAnuncio(anuncio: Anuncio) {
		let json = JSON.stringify(anuncio);
		let params = 'json=' + json;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post(this.url + 'anuncios', params, { headers: headers })
			.map(res => res.json());
	}

	addComentario(comentario: Comentario) {
		let json = JSON.stringify(comentario);
		let params = 'json=' + json;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post(this.url + 'comentarios', params, { headers: headers })
			.map(res => res.json());
	}

	editAnuncio(id, anuncio: Anuncio) {
		let json = JSON.stringify(anuncio);
		let params = "json=" + json;
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post(this.url + 'updateAdd/' + id, params, { headers: headers })
			.map(res => res.json());
	}

	deleteAnuncio(id) {
		return this._http.get(this.url + 'deleteAdd/' + id)
			.map(res => res.json());
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