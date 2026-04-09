export class InstrumentoReparo {
    constructor(
        public readonly id: number | null,
        public modeloMadeira: string,
        public dataEntrada: Date,
        public reparoConcluido: boolean,
        public custoReparo: number,
        public luthierId: number,
    ) {}
}
