'use strict';

class DetalleFlujoCajaMenor {
    constructor(idDetalleFcm = 0, ordenFlujo = 0, idEstadoCajaMenor = new EstadosCajaMenor(), idFlujoCajaMenor = new FlujosCajasMenores(),
    cajasMenoresList = []){

        this.idDetalleFcm = idDetalleFcm;
        this.ordenFlujo = ordenFlujo;
        this.idEstadoCajaMenor = idEstadoCajaMenor;
        this.idFlujoCajaMenor = idFlujoCajaMenor;
        this.cajasMenoresList = cajasMenoresList;
    }
}