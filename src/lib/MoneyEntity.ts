export class MoneyEntity {
    public id: number | undefined;
    public amount: number | undefined;
    public title: string | undefined;

    constructor(id?: number, amount?: number, title?: string) {
        this.id = id;
        this.amount = amount;
        this.title = title;
    }
}