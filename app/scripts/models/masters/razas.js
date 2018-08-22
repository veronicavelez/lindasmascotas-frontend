'use strict';

class Raza{
    constructor(idRaza = '', nombreRaza = '', mascotasList = [], idEspecie = new Especie() ){
        this.idRaza = idRaza;
        this.nombreRaza = nombreRaza;
        this.mascotasList = mascotasList;
        this.idEspecie = idEspecie;
    }
}