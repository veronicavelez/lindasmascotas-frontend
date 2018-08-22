'use strict';

class Tienda {
    constructor(posTienda = '', nombreTienda = '', direccion = '', telefono = '', baseCajaMenor = 0,
        cajasMenoresList = [], cronogramasList = [], idEstado = new EstadosTiendas(), 
        marcasEmpresa = new MarcasEmpresa(), idGerente = new Personal(),
        idCiudad = new UtilCiudades(), ) {

        this.posTienda = posTienda;
        this.nombreTienda = nombreTienda;
        this.direccion = direccion;
        this.telefono = telefono;
        this.baseCajaMenor = baseCajaMenor;
        this.cajasMenoresList = cajasMenoresList;
        this.cronogramasList = cronogramasList;
        this.idEstado = idEstado;
        this.marcasEmpresa = marcasEmpresa;
        this.idGerente = idGerente;
        this.idCiudad = idCiudad;
    }
}