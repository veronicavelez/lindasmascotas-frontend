'use strict';

class Propietario{
    constructor(idPropietario = '', nombrePropietario = '', apellidosPropietario = '', fechaNacimiento = '', correoElectronico = '',
                direccion = '', telefonoFijo = '', telefonoMovil = '', estado = false, idBarrio = new Barrio(), 
                idCiudad = new Ciudad(), idGenero = new Genero(), idTipoDocumento = new TiposDocumentos(),
                citasList = [], mascotasList = []){

        this.idPropietario = idPropietario;
        this.nombrePropietario = nombrePropietario;
        this.apellidosPropietario = apellidosPropietario;
        this.fechaNacimiento = fechaNacimiento;
        this.correoElectronico = correoElectronico;
        this.direccion = direccion;
        this.telefonoFijo = telefonoFijo;
        this.telefonoMovil = telefonoMovil;
        this.estado = estado;
        this.idBarrio = idBarrio;
        this.idCiudad = idCiudad;
        this.idGenero = idGenero;
        this.idTipoDocumento = idTipoDocumento;
        this.citasList = citasList;
        this.mascotasList = mascotasList;

    }
}