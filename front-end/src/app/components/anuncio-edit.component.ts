import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AnuncioService } from '../services/anuncio.service';
import { Anuncio } from '../models/anuncio';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'anuncio-edit',
	templateUrl: '../views/editAnuncio.html',
	providers: [AnuncioService]
})
export class AnuncioEditComponent {
	public titulo: string;
	public anuncio: Anuncio;
	public filesToUpload;
	public resultUpload;
	public is_edit;

	constructor(
		private _anuncioService: AnuncioService,
		private _route: ActivatedRoute,
		private _router: Router
	) {
		this.titulo = 'Editar anuncio';
		this.anuncio = new Anuncio(1, '', '', 1, '', '', '',false);
		this.is_edit = true;
	}

	ngOnInit() {
		console.log(this.titulo+ " cargado");
		if (localStorage.getItem("rolSesion") == "user" || localStorage.getItem("rolSesion") == "admin") {
			this.getAnuncio();
		}else{
			console.log("No hay usuario logueado")
			this._router.navigate(['']);
		}
	}

	onSubmit() {
		console.log(this.anuncio);

		if (this.filesToUpload && this.filesToUpload.length >= 1) {
			this._anuncioService.makeFileRequest(GLOBAL.url + 'upload-file', [], this.filesToUpload).then((result) => {
				console.log(result);

				this.resultUpload = result;
				this.anuncio.imagen = this.resultUpload.filename;
				this.updateAnuncio();

			}, (error) => {
				console.log(error);
			});
		} else {
			this.updateAnuncio();
		}

	}

	updateAnuncio() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._anuncioService.editAnuncio(id, this.anuncio).subscribe(
				response => {
					if (response.code == 200) {
						this._router.navigate(['/detalles', id]);
					} else {
						console.log(response);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

	salir() {
		localStorage.clear();
		this._router.navigate(['']);
		this._router.navigate([window.location.reload()]);
	  }

	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload);
	}

	getAnuncio() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._anuncioService.getAnuncio(id).subscribe(
				response => {
					if (response.code == 200) {
						this.anuncio = response.data;
					} else {
						this._router.navigate(['/anuncios']);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}
}