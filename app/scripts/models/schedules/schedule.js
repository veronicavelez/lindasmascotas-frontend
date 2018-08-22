'use strict';

class Cronograma {
    constructor(idCronograma = 0, fechaVisita = null, observaciones = '', fechaInicioArqueo = null, fechaFinalArqueo = null, observacionesArqueo = '',
        diferenciaCajaMenor = null, observacionesCajaMenor = '', diferenciaCajaGeneral = null, observacionesCajaGeneral = '', soportesArqueosList = [], 
        idEstadoVisita = new EstadoVisita(), posTienda = new Tienda(), idAuditor = new Personal(), idCiudad = new UtilCiudades(),
        pazSalvo = null) {

        this.idCronograma = idCronograma;
        this.fechaVisita = fechaVisita;
        this.observaciones = observaciones;
        this.fechaInicioArqueo = fechaInicioArqueo;
        this.fechaFinalArqueo = fechaFinalArqueo;
        this.observacionesArqueo = observacionesArqueo;
        this.diferenciaCajaMenor = diferenciaCajaMenor;
        this.observacionesCajaMenor = observacionesCajaMenor;
        this.diferenciaCajaGeneral = diferenciaCajaGeneral;
        this.observacionesCajaGeneral = observacionesCajaGeneral;
        this.soportesArqueosList = soportesArqueosList;
        this.idEstadoVisita = idEstadoVisita;
        this.posTienda = posTienda;
        this.idAuditor = idAuditor;
        this.pazSalvo = pazSalvo;
    }
}