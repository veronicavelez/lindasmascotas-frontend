'use strict';

class CajaMenor {
    constructor(idCajaMenor = 0, consecutivoFisico = null, fechaDesde = null, fechaHasta = null,
                valorTotal = 0, observaciones = null, idDetalleFlujoCm = new DetalleFlujoCajaMenor(),
                posTienda = new Tienda(), detallesCajaMenorList = []){
                
        this.idCajaMenor = idCajaMenor;
        this.consecutivoFisico = consecutivoFisico;
        this.fechaDesde = fechaDesde;
        this.fechaHasta = fechaHasta;
        this.valorTotal = valorTotal;
        this.observaciones = observaciones;
        this.idDetalleFlujoCm = idDetalleFlujoCm;
        this.posTienda = posTienda;
        this.detallesCajaMenorList = detallesCajaMenorList;
    }
}