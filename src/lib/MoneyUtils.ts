import { create, deleteById, getList, updateTitle } from "$lib/apiCaller";
import { MoneyEntity } from "$lib/MoneyEntity";

export class MoneyUtils {
    static async addMoneyEntity(entity: MoneyEntity) {
        if (!entity.amount || entity.amount <= 0) return;
        await create(entity.amount);
    }

    static async deleteEntityById(id?: number) {
        if (id == undefined) return;
        await deleteById(id);
    }

    static async updateEntityTitle(id?: number, title?: string) {
        if (!id) return;
        if (!title || title.trim() === "") return;
        await updateTitle(id, title);
    }

    static async fetchGroupedEntities(): Promise<{
        testMap: Map<string, MoneyEntity[]>;
        list: MoneyEntity[];
    }> {
        const list = await getList();
        const testMap = new Map<string, MoneyEntity[]>();
        let firstDateString = "";
        list.forEach((money) => {
            if (!money.date) return;
            const year = money.date.getFullYear().toString();
            const month = (money.date.getMonth() + 1).toString().padStart(2, "0");
            const dateKey = year + month;

            if (!testMap.has(dateKey)) {
                testMap.set(dateKey, []);
            }
            testMap.get(dateKey)?.push(money);

            if (!firstDateString) {
                firstDateString = dateKey;
            }
        });

        return { testMap, list };
    }

    static convertDateString(dateString: string): string {
        const dateParts = dateString.match(/.{1,4}/g);
        if (!dateParts) return "";
        const [year, month] = dateParts;
        return Intl.DateTimeFormat("de", { month: "long" }).format(new Date(month)) +
            " " + year;
    }

    static addUpMoneyList(list: MoneyEntity[]) {
        return list.reduce((sum, entity) => sum + (entity.amount ?? 0), 0);
    }
}
