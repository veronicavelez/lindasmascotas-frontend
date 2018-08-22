'use strict'

class ResponseLm {
    constructor(status = false, message = '', data = []) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}