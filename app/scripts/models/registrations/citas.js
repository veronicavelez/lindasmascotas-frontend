'use strict';

class Cita {
    constructor(idCita = '', nombreMascota = '', fechaCita = '', telefonoMovil = 0, idEmpleado = new Empleado(), idPropietario = new Propietario(), 
                idTipoServicio = new Servicio()){

        this.idCita = idCita;
        this.nombreMascota = nombreMascota;
        this.fechaCita = fechaCita;
        this.telefonoMovil = telefonoMovil;
        this.idEmpleado = idEmpleado;
        this.idPropietario = idPropietario;
        this.idTipoServicio = idTipoServicio;

    }
}
