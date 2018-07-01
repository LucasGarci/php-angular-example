import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AnuncioService } from '../services/anuncio.service';
import { Anuncio } from '../models/anuncio';

@Component({
	selector: 'anuncios',
	templateUrl: '../views/anuncios.html',
	providers: [AnuncioService]
})

export class AnunciosComponent {
	public usuarioSesion: string;
	public anuncios: Anuncio[];
	public anuncio: Anuncio;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _anuncioService: AnuncioService
		
	) {
		this.confirmado = null;
		this.usuarioSesion=localStorage.getItem('usuarioSesion');
	}

	ngOnInit() {
		console.log('anuncios.component.ts cargado');
		if (localStorage.getItem("rolSesion") == "user" || localStorage.getItem("rolSesion") == "admin") {
			this.getAnuncios();
		} else {
			console.log("No hay usuario logueado")
			this._router.navigate(['']);
		}
	}

	salir() {
		localStorage.clear();
		this._router.navigate(['']);
		this._router.navigate([window.location.reload()]);
	}

	getAnuncios() {
		this._anuncioService.getAnuncios().subscribe(
			result => {

				if (result.code != 200) {
					console.log(result);
				} else {
					this.anuncios = result.data;
					this.anuncios.forEach(a => {
						if(localStorage.getItem('usuarioSesion')==a.autor){
							a.showable=true;
						}else{
							a.showable=false;
						}
						
					});
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	onDeleteAnuncio(id) {
		this._anuncioService.getAnuncio(id).subscribe(
			response => {
				if (response.code == 200) {
					this.anuncio = response.data;
					console.log("Anuncio to delete...")
					console.log(this.anuncio);
				} else {
					this._router.navigate(['/anuncios'])
				}
			},
			error => {
				console.log(<any>error);
			}
		); 

		if (this.anuncio.autor == localStorage.getItem('usuarioSesion')) {
			
			this._anuncioService.deleteAnuncio(id).subscribe(
				response => {
					if (response.code == 200) {
						this.getAnuncios();
					} else {
						alert('Error al borrar anuncio');
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		}
	}
}