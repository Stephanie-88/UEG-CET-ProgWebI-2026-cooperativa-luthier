export class Luthier {
    constructor(
        public readonly id: number | null,
        public nomeMestre: string,
        public dataAbertura: Date,
        public certificada: boolean,
        public bancadasNum: number,
    ) {}
}
