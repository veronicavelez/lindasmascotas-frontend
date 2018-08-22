'use strict';

class ControlVisitaTienda {
    constructor(posTienda = '', programadas = 0, mes = '', annio = '', tiendas = new Tienda()){
        this.posTienda = posTienda;
        this.programadas = programadas;
        this.mes = mes;
        this.annio = annio;
        this.tiendas = tiendas;
    }
}

// class ControlVisitaTienda {
//     constructor(controlVisitaTiendasPK = new ControlVisitaTiendaPK(), programadas = 0, tiendas = new Tienda()){
//         this.controlVisitaTiendasPK = controlVisitaTiendasPK;
//         this.programadas = programadas;
//         this.tiendas = tiendas;
//     }
// }