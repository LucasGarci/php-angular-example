import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import * as shajs from 'sha.js';
import { Usuario } from '../models/usuario';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'usuario-edit',
    templateUrl: '../views/perfil.html',
    providers: [UsuarioService]
})
export class UserEditComponent {
    public titulo: string;
    public usuario: Usuario;
    public filesToUpload;
    public resultUpload;
    public is_edit;

    constructor(
        private _usuarioService: UsuarioService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.titulo = 'Editar usuario';
        this.usuario = new Usuario('', '', '', '', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {

        if (localStorage.getItem("rolSesion") == "user" || localStorage.getItem("rolSesion") == "admin") {
            console.log(this.titulo + " cargado");
            this.getUsuario();
        } else {
            console.log("No hay usuario logueado")
            this._router.navigate(['']);
        }
    }

    onSubmit() {
        console.log('Usuario actual:');
        console.log(this.usuario);
        if (this.filesToUpload && this.filesToUpload.length >= 1) {
            this._usuarioService.makeFileRequest(GLOBAL.url + 'upload-file', [], this.filesToUpload).then((result) => {
                console.log(result);
                this.resultUpload = result;
                this.usuario.imagen = this.resultUpload.filename;
                console.log("User img: " + this.resultUpload.filename);
                this.updateUsuario();

            }, (error) => {
                console.log(error);
            });
        } else {
            this.updateUsuario();
        }

    }

    salir() {
        localStorage.clear();
        this._router.navigate(['']);
        this._router.navigate([window.location.reload()]);
      }

    updateUsuario() {
        this._route.params.forEach((params: Params) => {
            if (this.usuario.newpass != '' && this.usuario.newpass != null) {
                this.usuario.pass = shajs('sha256').update(this.usuario.newpass).digest('hex');
            }
            console.log('El usuario to update es...');
            console.log(this.usuario);
            this._usuarioService.editUsuario(this.usuario.mail, this.usuario).subscribe(
                response => {
                    if (response.code == 200) {
                        this._router.navigate([window.location.reload()]);
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    getUsuario() {
        this._route.params.forEach((params: Params) => {
            this._usuarioService.getUsuario(localStorage.getItem("usuarioSesion")).subscribe(
                response => {
                    if (response.code == 200) {
                        this.usuario = response.data;
                        console.log("El usuario recogido es...")
                        console.log(response.data);
                    } else {
                        this._router.navigate(['/perfil']);
                    }
                },
                error => {
                    console.log(<any>error);
                }
            );
        });
    }
}