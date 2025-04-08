<script lang="ts">
	import "../app.css";
	import { MoneyEntity } from "$lib/MoneyEntity";
	import { onDestroy, onMount } from "svelte";
	import { MoneyUtils } from "$lib/MoneyUtils";

	var testMap: Map<string, MoneyEntity[]> = $state(
		new Map<string, MoneyEntity[]>(),
	);
	var list: Array<MoneyEntity> = $state([]);
	var refreshInterval: NodeJS.Timeout | undefined;
	var realyCanceIndex: number | undefined = $state(undefined);
	var moneyEntity: MoneyEntity = $state(new MoneyEntity());
	var isTitleEdited: boolean = $state(false);

	function armDelete(i: number) {
		realyCanceIndex = i;
	}

	async function updateList() {
		if (!isTitleEdited) {
			await MoneyUtils.fetchGroupedEntities().then((data) => {
				testMap = data.testMap;
				list = data.list;
			});
		}
	}

	onMount(async () => {
		await updateList();
		refreshInterval = setInterval(updateList, 3000);
	});

	onDestroy(async () => {
		clearInterval(refreshInterval);
	});

	async function onFocus() {
		await updateList();
		refreshInterval = setInterval(updateList, 3000);
	}
</script>

<svelte:window
	on:focus={onFocus}
	on:blur={() => clearInterval(refreshInterval)}
/>

<div class="h-60 flex items-center justify-center">
	<input
		type="number"
		inputmode="numeric"
		class="input w-20 text-center"
		onchange={() => {
			MoneyUtils.addMoneyEntity(moneyEntity);
			updateList();
		}}
		bind:value={moneyEntity.amount}
	/>
</div>
{#each [...testMap] as [key, value], i}
	<div class="collapse bg-base-100 border border-base-300">
		<input
			type="radio"
			name="my-accordion-1"
			checked={i == 0}
			onchange={(realyCanceIndex = undefined)}
		/>
		<div class="collapse-title flex gap-4">
			<span class="text-xl">
				{MoneyUtils.addUpMoneyList(value)}€ {MoneyUtils.convertDateString(
					key,
				)}
			</span>
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
							onchange={async () => {
								MoneyUtils.updateEntityTitle(
									listMoneyEntity.id,
									listMoneyEntity.title,
								);
								updateList();
							}}
							onfocus={() => (isTitleEdited = true)}
							onblur={async () => {
								isTitleEdited = false;
								await updateList();
							}}
						/>
						{#if i == realyCanceIndex}
							<button
								aria-label="actuallyDelete"
								class="btn btn-square w-16"
								onclick={() => {
									if (realyCanceIndex == undefined) return;
									MoneyUtils.deleteEntityById(
										list[realyCanceIndex].id,
									);
									updateList();
									realyCanceIndex = undefined;
								}}
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
