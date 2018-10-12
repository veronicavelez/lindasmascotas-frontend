'use strict';

class Servicio{
    constructor(idServicio = '', nombreServicio = '', precioServicio = '', descripcionServicio = '', citasList = [], procedimientosList = [], empleadosList = []){
        this.idServicio = idServicio;
        this.nombreServicio = nombreServicio;
        this.precioServicio = precioServicio;
        this.descripcionServicio = descripcionServicio;
        this.citasList = citasList;
        this.procedimientosList = procedimientosList;
        this.empleadosList = empleadosList;
    }
}