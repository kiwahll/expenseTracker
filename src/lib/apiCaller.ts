import { MoneyEntity } from "./MoneyEntity";

export async function getList(): Promise<MoneyEntity[]> {
    var returnList: MoneyEntity[] = [];

    await fetch("/api/list")
        .then((response) => response.json())
        .then(data => {
            data.forEach((money: any) => {
                returnList.push(new MoneyEntity(money.id, Number(money.amount), money.title));
            });
        });
    return returnList;
}

export async function create(amount: number, title: string) {
    await fetch("/api/create", {
        method: "POST", body: JSON.stringify({ amount , title })
    });
}