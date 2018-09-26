'use strict';

class Mascota {
    constructor(idMascota = '', nombreMascota = '', fechaNacimiento = '', peso = '', estado = false, vive = '', 
            idEspecie = new Especie(),idSexo = new Sexo(), idRaza = new Raza(), idPropietario = new Propietario(), 
            procedimientosList=[]){

        this.idMascota = idMascota;
        this.nombreMascota = nombreMascota;
        this.fechaNacimiento = fechaNacimiento;
        this.peso = peso;
        this.estado = estado;
        this.vive = vive;
        this.idEspecie = idEspecie;
        this.idRaza = idRaza;
        this.idSexo = idSexo;
        this.idPropietario = idPropietario;
        this.procedimientosList = procedimientosList;

    }
}