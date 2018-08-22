'use strict'

class MarcasEmpresa {
    constructor(marcasEmpresaPK = new MarcasEmpresaPK(), empresas = new Empresas(), 
    marcas = new Marcas(), tiendasList = []) {
        this.marcasEmpresaPK = marcasEmpresaPK;
        this.empresas = empresas;
        this.marcas = marcas;
        this.tiendasList = tiendasList;
    }
}