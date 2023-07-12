<script>
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	let loading = false;
	let error = '';
	let modal_visible = false;
	let new_version = '';
	let new_enabled = false;
	let new_latest = false;

	/**
	 * @type {FileList}
	 */
	let files;

	function showhide_modal(v = true) {
		return () => (modal_visible = v);
	}

	async function create_update() {
		error = '';
		if (!files || !files.length || !new_version) {
			error = 'validation';
			return;
		}
		const input = new FormData();
		input.append('file', files[0]);
		input.append('version', new_version);
		input.append('enabled', new_enabled.toString());
		input.append('latest', new_latest.toString());

		loading = true;
		const { status } = await fetch('/api/updates', {
			method: 'POST',
			body: input
		});
		loading = false;
		if (status !== 201) {
			error = 'create';
		} else {
			modal_visible = false;
			invalidateAll();
		}
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if modal_visible}
	<div class="modal" on:click={showhide_modal(false)} role="presentation">
		<div on:click|stopPropagation role="presentation">
			<h2>Publish a Firmware Update</h2>
			<div>
				<p>Version name</p>
				<input class="string" bind:value={new_version} />
			</div>
			<div>
				<p>Set as enabled</p>
				<label class="switch">
					<input type="checkbox" bind:checked={new_enabled} />
					<span class="slider" />
				</label>
			</div>
			<div>
				<p>Tag as latest release</p>
				<label class="switch">
					<input type="checkbox" bind:checked={new_latest} />
					<span class="slider" />
				</label>
			</div>
			<div class="file">
				<p>Upload the firmware</p>
				<input bind:files id="firmware" name="firmware" type="file" />
			</div>
			<button class="close" on:click={showhide_modal(false)}>
				<span class="material-symbols-outlined">&#xe5cd</span>
			</button>
			<button class="publish" on:click={create_update}>
				Publish Update <span class="material-symbols-outlined">&#xe255</span>
				{#if loading}
					<div class="loader" />
				{/if}
			</button>
			{#if error === 'validation'}
				<p style="color:red;">Input validation failed. Fill out all fields.</p>
			{/if}
			{#if error === 'create'}
				<p style="color:red;">Failed to create upload. Try again later.</p>
			{/if}
		</div>
	</div>
{/if}
<h1>Dashboard</h1>
<div class="top-section">
	<p>Total count of updates: {data?.updates?.length || 0}</p>
	<button class="create" on:click={showhide_modal()}
		>Create Update <span class="material-symbols-outlined">&#xe2c3</span></button
	>
</div>
<table>
	<tr>
		<th>ID</th>
		<th>Version</th>
		<th>Uploader</th>
		<th>Hash</th>
		<th>Enabled</th>
		<th>Latest</th>
		<th>Timestamp</th>
	</tr>
	{#if data?.updates?.length}
		{#each data.updates as { id, version, uploader, hash, enabled, latest, timestamp }}
			<tr>
				<td>{id}</td>
				<td>{version}</td>
				<td>{uploader}</td>
				<td>{hash}</td>
				<td>
					{#if enabled}
						<span class="material-symbols-outlined">&#xe5ca</span>
					{:else}
						<span class="material-symbols-outlined">&#xe5cd</span>
					{/if}
				</td>
				<td>
					{#if latest}
						<span class="material-symbols-outlined">&#xe5ca</span>
					{:else}
						<span class="material-symbols-outlined">&#xe5cd</span>
					{/if}
				</td>
				<td>{timestamp}</td>
			</tr>
		{/each}
	{/if}
	{#if !data.updates?.length}
		<tr>
			<td colspan="7" class="c">No data</td>
		</tr>
	{/if}
</table>

<style>
	input.string {
		border: none;
		height: 30px;
		border-radius: 5px;
		width: 250px;
		padding: 5px 15px;
		font-size: 16px;
		font-family: Roboto;
	}
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 34px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
		border-radius: 50%;
	}

	input:checked + .slider {
		background-color: black;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px black;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	button.close {
		position: absolute;
		top: 20px;
		right: 20px;
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
	}
	button.publish {
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
		background-color: black;
		color: white;
		width: 220px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 30px;
		margin-left: auto;
		margin-top: 20px;
	}
	h2 {
		margin: 0;
		font-weight: 300;
		text-align: center;
		padding-bottom: 30px;
	}
	input:focus {
		outline: none;
	}
	.modal {
		z-index: 10;
		inset: 0;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(225, 255, 0, 0.5);
	}
	.modal > div {
		width: 800px;
		min-height: 300px;
		border-radius: 5px;
		background-color: #efdc05;
		position: relative;
		padding: 20px 100px;
		display: flex;
		flex-direction: column;
	}
	.modal > div > div:not(.file) {
		display: flex;
		padding: 10px;
		justify-content: space-between;
		align-items: center;
	}
	.c {
		text-align: center;
	}
	div.top-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 10px 0;
	}
	p {
		margin: 0;
		font-weight: 300;
	}
	h1 {
		text-align: center;
	}
	button.create {
		display: flex;
		align-items: center;
		padding: 8px 20px;
		text-transform: uppercase;
		background-color: #cebd03;
		background: linear-gradient(to right, #cbbb02, #efdc05);
		color: white;
		font-weight: 500;
		border: none;
		cursor: pointer;
		border-radius: 5px;
	}
	button > span {
		margin-left: 10px;
	}
	button:hover {
		opacity: 0.6;
	}
	table {
		border-collapse: separate;
		border-spacing: 0;
		width: 100%;
	}
	td,
	th {
		border: 1px solid #f1e66d;
		text-align: left;
		padding: 8px;
	}
	td > span {
		display: flex;
		justify-content: center;
	}
	tr:nth-child(even) {
		background-color: #f1e66d;
		background: linear-gradient(#f1e66d, #f5e535);
	}
	th:first-child {
		border-top-left-radius: 5px;
	}
	th:last-child {
		border-top-right-radius: 5px;
	}
	tr:last-child > td:first-child {
		border-bottom-left-radius: 5px;
	}
	tr:last-child > td:last-child {
		border-bottom-right-radius: 5px;
	}
	tr:hover:not(:first-child) {
		opacity: 0.5;
	}
	div.file {
		text-align: center;
		flex-direction: column;
		padding: 30px;
	}
	div.file > input {
		margin-right: -40px;
		margin-top: 20px;
	}
	.loader {
		border: 2px solid black;
		border-top: 2px solid white;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
		margin-left: 10px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
