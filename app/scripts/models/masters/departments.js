'use strict';

class Departamento{
    constructor(idDepartamento = '', nombreDepartamento = '', idPais = new Pais()){
        this.idDepartamento = idDepartamento;
        this.nombreDepartamento = nombreDepartamento;
        this.idPais = idPais;
    }
}
