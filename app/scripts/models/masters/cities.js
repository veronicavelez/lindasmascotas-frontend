'use strict';

class Ciudad{
    constructor(idCiudad = '', nombreCiudad = '', idDpto = new Departamento()){
        this.idCiudad = idCiudad;
        this.nombreCiudad = nombreCiudad;
        this.idDpto = idDpto;
    }
}

