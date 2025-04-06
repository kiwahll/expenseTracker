import { MoneyEntity } from "./MoneyEntity";

export async function getList(): Promise<MoneyEntity[]> {
    var returnList: MoneyEntity[] = [];

    await fetch("/api/list")
        .then((response) => response.json())
        .then(data => {
            data.forEach((money: any) => {
                returnList.push(new MoneyEntity(money.id, Number(money.amount), money.title, new Date(money.date)));
            });
        });
    return returnList;
}

export async function create(amount: number) {
    await fetch("/api/create", {
        method: "POST", body: JSON.stringify({ amount })
    });
}

export async function deleteById(id: number) {
    if (id == undefined || id == null) return;
    await fetch("/api/delete", {
        method: "POST", body: JSON.stringify({ id })
    });
}

export async function updateTitle(id: number, title: string) {
    if (id == undefined || id == null) return;
    if (title == undefined || title == null || title == "") return;
    await fetch("/api/updateTitle", {
        method: "POST", body: JSON.stringify({ id, title })
    }).then(data => console.log(data));
}