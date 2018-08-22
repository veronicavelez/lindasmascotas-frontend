'use strict';

class EstadoVisita {
    constructor(idEstadoVisita = 0, nombreEstadoVisita = '', cronogramasList = []) {
        this.idEstadoVisita = idEstadoVisita;
        this.nombreEstadoVisita = nombreEstadoVisita;
        this.cronogramasList = cronogramasList;
    }
}