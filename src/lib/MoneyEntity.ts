export class MoneyEntity {
    public id: number | undefined;
    public amount: number | undefined;
    public title: string | undefined;
    public date: Date | undefined;

    constructor(id?: number, amount?: number, title?: string, date?: Date) {
        this.id = id;
        this.amount = amount;
        this.title = title;
        this.date = date;
    }
}