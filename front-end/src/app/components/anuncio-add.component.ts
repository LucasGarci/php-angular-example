import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AnuncioService } from '../services/anuncio.service';
import { Anuncio } from '../models/anuncio';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'anuncio-add',
	templateUrl: '../views/addAnuncio.html',
	providers: [AnuncioService]
})
export class AnuncioAddComponent {
	public anuncio: Anuncio;
	public filesToUpload;
	public resultUpload;

	constructor(
		private _anuncioService: AnuncioService,
		private _route: ActivatedRoute,
		private _router: Router
	) {
		this.anuncio = new Anuncio(0, '', '', 0, '', '', '',false);
	}

	ngOnInit() {
		console.log('anuncio-add.component.ts cargado...');
		if (localStorage.getItem("rolSesion") == "user" || localStorage.getItem("rolSesion") == "admin") {
		} else {
			console.log("No hay usuario logueado")
			this._router.navigate(['']);
		}
	}

	onSubmit() {
		console.log('submit anuncio: ' + this.anuncio);

		if (this.filesToUpload && this.filesToUpload.length >= 1) {
			console.log('dentro del if')
			this._anuncioService.makeFileRequest(GLOBAL.url + 'upload-file', [], this.filesToUpload).then((result) => {
				console.log('result primero: ' + result);

				this.resultUpload = result;
				console.log('result segundo: ' + result);
				this.anuncio.imagen = this.resultUpload.filename;
				this.anuncio.autor = localStorage.getItem('usuarioSesion');
				console.log('resultupload: ' + this.resultUpload.filename);
				this.saveAnuncio();

			}, (error) => {
				console.log(error);
			});
		} else {
			this.saveAnuncio();
		}

	}

	salir() {
		localStorage.clear();
		this._router.navigate(['']);
		this._router.navigate([window.location.reload()]);
	  }

	saveAnuncio() {
		this._anuncioService.addAnuncio(this.anuncio).subscribe(
			response => {
				if (response.code == 200) {
					this._router.navigate(['/anuncios']);
				} else {
					console.log(response);
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}
}