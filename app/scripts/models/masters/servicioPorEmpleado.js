'use strict';

class ServicioPorEmpleado{
    constructor(idServEmpl = '', idEmpleado = new Empleado(), idServicio = new Servicio()){
        this.idServEmpl = idServEmpl;
        this.idEmpleado = idEmpleado;
        this.idServicio = idServicio;
    }
}