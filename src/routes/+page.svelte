<script lang="ts">
    import "../app.css";
    import { MoneyEntity } from "$lib/MoneyEntity";
    import { onDestroy, onMount } from "svelte";
    import { create, deleteById, getList, updateTitle } from "$lib/apiCaller";

    var list: Array<MoneyEntity> = $state([]);
    var refreshInterval: NodeJS.Timeout | undefined;
    var realyCanceIndex: number | null = $state(null);
    var moneyEntity: MoneyEntity = $state(new MoneyEntity());
    var isTitleEdited: boolean = $state(false);

    async function addMoneyEntity() {
        if (moneyEntity.amount == undefined) return;
        if (moneyEntity.amount != 0 && moneyEntity.amount < 0) return;
        await create(moneyEntity.amount);
        await refreshList();
        moneyEntity = new MoneyEntity();
    }

    function armDelete(i: number) {
        realyCanceIndex = i;
    }

    async function actuallyDelete(i: number) {
        if (realyCanceIndex == null) return;
        if (list[realyCanceIndex] != undefined) {
            await deleteById(Number(list[realyCanceIndex].id));
            await refreshList();
        }
        realyCanceIndex = null;
    }

    async function refreshList() {
        if (isTitleEdited) return;
        await getList().then(data => list = data);
    }

    onMount(async () => {
        await refreshList();
        refreshInterval = setInterval(refreshList, 3000);
    });

    onDestroy(async () => {
        if (refreshInterval != undefined) {
            clearInterval(refreshInterval);
        }
    });

    async function onFocus() {
        refreshInterval = setInterval(refreshList, 3000);
        await refreshList();
    }

    async function titleOnChange(id?: number, title?: string) {
        if (id == undefined || id < 0) return;
        if (title == undefined || title == "") return;
        await updateTitle(id, title);
        await refreshList();
    }
</script>

<meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
/>
<svelte:window on:focus={onFocus} on:blur={() => clearInterval(refreshInterval)} />

<div class="h-60 flex items-center justify-center">
    <input
        type="number"
        inputmode="numeric"
        class="input w-20 text-center"
        onchange={() => addMoneyEntity()}
        bind:value={moneyEntity.amount}
    />
</div>
<ul class="list bg-base-100 rounded-box shadow-md">
    {#if list.length != 0}
        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Ausgaben</li>
    {/if}
    {#each list as listMoneyEntity, i}
        <li class="list-row">
            <div>
                <span class="text-3xl font-bold">{listMoneyEntity.amount}</span>
                <span class="text-3xl font-semibold">€</span>
            </div>
            <input
                type="text"
                class="input w-full"
                bind:value={listMoneyEntity.title}
                onchange={async () => titleOnChange(listMoneyEntity.id, listMoneyEntity.title)}
                onfocus={() => isTitleEdited = true}
                onblur={async () => {
                    isTitleEdited = false;
                    refreshList();
                }}
            />
            {#if i == realyCanceIndex}
                <button
                    aria-label="actuallyDelete"
                    class="btn btn-square w-16"
                    onclick={() => actuallyDelete(i)}
                >
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#FF0000"
                        ><path
                            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
                            stroke="#FF0000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path><path
                            d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6"
                            stroke="#FF0000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path></svg
                    >
                </button>
            {:else}
                <button
                    aria-label="armDelete"
                    class="btn btn-square"
                    onclick={() => armDelete(i)}
                >
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#000000"
                        ><path
                            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
                            stroke="#000000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path><path
                            d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6"
                            stroke="#000000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path></svg
                    >
                </button>
            {/if}
        </li>
    {/each}
</ul>
