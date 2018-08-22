'use strict';

class DetalleCajaMenor {
    constructor(idDetalleCajamenor = '', valorRubro = null, idCajaMenor = new CajaMenor(),
                idRubro = new Rubros()) {

        this.idDetalleCajamenor = idDetalleCajamenor;
        this.valorRubro = valorRubro;
        this.idCajaMenor = idCajaMenor;
        this.idRubro = idRubro;
    }
}