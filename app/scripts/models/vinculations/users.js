'use strict';

class Personal {
    constructor(idPersonal = '', nombres = '', papellido = '', sapellido = '', email = '', contrasena = '',
        estado = false, idCargo = new UtilCargos(), idCiudad = new UtilCiudades(),
        idTipoDocumento = new TiposDocumentos(), usuPermisosList = [], cronogramasList = [],
        tiendasList = []) {

        this.idPersonal = idPersonal;
        this.nombres = nombres;
        this.papellido = papellido;
        this.sapellido = sapellido;
        this.email = email;
        this.contrasena = contrasena;
        this.estado = estado;
        this.idCargo = idCargo;
        this.idCiudad = idCiudad;
        this.idTipoDocumento = idTipoDocumento;
        this.usuPermisosList = usuPermisosList;
        this.cronogramasList = cronogramasList;
        this.tiendasList = tiendasList;
    }
}