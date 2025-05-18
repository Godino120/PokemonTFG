import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class RegistroService{

    constructor(private router:Router, private http: HttpClient){}

    crearUsuario(usuario:string,correo:string, contrasena:string): Observable<Usuario>{
        const usuarioNuevo = { usuario,  correo, contrasena };
        return this.http.post<Usuario>('http://localhost:8080/api/usuario/registro', usuarioNuevo);
    }
}