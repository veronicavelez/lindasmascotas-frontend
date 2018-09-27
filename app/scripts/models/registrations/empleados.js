'use strict';

class Empleado{
    constructor(idEmpleado = '', nombreEmpleado = '', apellidosEmpleado = '', fechaNacimiento = '', tipoRh = '', correoElectronico = '',
                direccion = '', telefonoFijo = '', telefonoMovil = '', estadoEmpleado = false, fechaContratoInicial = '', fechaContratoFinal = '',
                idBarrio = new Barrio(), idCargo = new Cargo(), idCiudad = new Ciudad(), idGenero = new Genero(), idPerfil = new Perfil(),
                idTipoContrato = new TipoContrato(), idTipoDocumento = new TiposDocumentos(), idTipoSangre = new TipoSangre(), procedimientosList=[]){

        this.idEmpleado = idEmpleado;
        this.nombreEmpleado = nombreEmpleado;
        this.apellidosEmpleado = apellidosEmpleado;
        this.fechaNacimiento = fechaNacimiento;
        this.tipoRh = tipoRh;
        this.correoElectronico = correoElectronico;
        this.direccion = direccion;
        this.telefonoFijo = telefonoFijo;
        this.telefonoMovil = telefonoMovil;
        this.estadoEmpleado = estadoEmpleado;
        this.fechaContratoInicial = fechaContratoInicial;
        this.fechaContratoFinal = fechaContratoFinal;
        this.idBarrio = idBarrio;
        this.idCargo = idCargo;
        this.idCiudad = idCiudad;
        this.idGenero = idGenero;
        this.idPerfil = idPerfil;
        this.idTipoContrato = idTipoContrato;
        this.idTipoDocumento = idTipoDocumento;
        this.idTipoSangre = idTipoSangre;
        this.procedimientosList = procedimientosList;
    }
}