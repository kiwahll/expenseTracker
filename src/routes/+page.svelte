<script lang="ts">
	import "../app.css";
	import { MoneyEntity } from "$lib/MoneyEntity";
	import { onDestroy, onMount } from "svelte";
	import { create, deleteById, getList, updateTitle } from "$lib/apiCaller";

	var testMap: Map<string, MoneyEntity[]> = $state(
		new Map<string, MoneyEntity[]>(),
	);
	var list: Array<MoneyEntity> = $state([]);
	var refreshInterval: NodeJS.Timeout | undefined;
	var realyCanceIndex: number | null = $state(null);
	var moneyEntity: MoneyEntity = $state(new MoneyEntity());
	var isTitleEdited: boolean = $state(false);
	var firstDateString: string = $state("");

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

	async function actuallyDelete() {
		if (realyCanceIndex == null) return;
		if (list[realyCanceIndex] != undefined) {
			await deleteById(Number(list[realyCanceIndex].id));
			await refreshList();
		}
		realyCanceIndex = null;
	}

	async function refreshList() {
		if (isTitleEdited) return;
		await getList().then((data) => (list = data));

		testMap = new Map<string, MoneyEntity[]>();
		var currentString: string = "";
		list.forEach((money) => {
			if (money.date == undefined) return;
			var maybeNewString: string = money.date?.getFullYear().toString();
			if (money.date?.getMonth().toString().length == 1) {
				maybeNewString += "0" + money.date?.getMonth().toString();
			} else {
				maybeNewString += money.date?.getMonth().toString();
			}
			if (currentString != maybeNewString) {
				currentString = maybeNewString;
			}

			if (testMap.get(currentString) == undefined) {
				testMap.set(currentString, [money]);
			} else {
				if (testMap.get(currentString) != undefined) {
					var aslökdfjaslökdjf: MoneyEntity[] =
						testMap.get(currentString);
					aslökdfjaslökdjf.push(money);
				}
			}

			if (firstDateString == "") {
				firstDateString = currentString;
			}
		});
		console.log(testMap);
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

	function convertDateStrig(dateString: string) {
		var dateStringArray = dateString.match(/.{1,4}/g);
		if (dateStringArray == undefined) return "";
		return (
			Intl.DateTimeFormat("de", { month: "long" }).format(
				new Date(dateStringArray[1]),
			) +
			" " +
			dateStringArray[0]
		);
	}

	function addUpMoneyList(list: MoneyEntity[]) {
		var sum: number = 0;
		list.forEach(moneyEntity => {
			if (moneyEntity.amount == undefined) return;
			sum += moneyEntity.amount;
		});
		return sum;
	}
</script>

<meta
	name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
/>
<meta name="theme-color" content="#000000">
<svelte:window
	on:focus={onFocus}
	on:blur={() => clearInterval(refreshInterval)}
/>

<div class="h-60 flex items-center justify-center">
	<input
		type="number"
		inputmode="numeric"
		class="input w-20 text-center"
		onchange={() => addMoneyEntity()}
		bind:value={moneyEntity.amount}
	/>
</div>
{#each [...testMap] as [key, value]}
	<div class="collapse bg-base-100">
		<input type="radio" name="my-accordion-1" checked="checked" />
		<div class="collapse-title flex gap-4">
			<div class="font-semibold text-xl">
				{addUpMoneyList(value)}€
			</div>
			<div>
				{convertDateStrig(key)}
			</div>
		</div>
		<div class="collapse-content">
			<ul class="list bg-base-100 rounded-box shadow-md">
				{#each value as listMoneyEntity, i}
					<li class="list-row">
						<div>
							<span class="text-3xl font-bold"
								>{listMoneyEntity.amount}</span
							>
							<span class="text-3xl font-semibold">€</span>
						</div>
						<input
							type="text"
							class="input w-full"
							bind:value={listMoneyEntity.title}
							onchange={async () =>
								titleOnChange(
									listMoneyEntity.id,
									listMoneyEntity.title,
								)}
							onfocus={() => (isTitleEdited = true)}
							onblur={async () => {
								isTitleEdited = false;
								refreshList();
							}}
						/>
						{#if i == realyCanceIndex}
							<button
								aria-label="actuallyDelete"
								class="btn btn-square w-16"
								onclick={() => actuallyDelete()}
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
		</div>
	</div>
{/each}
