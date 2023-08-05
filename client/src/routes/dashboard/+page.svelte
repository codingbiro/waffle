<script>
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	let loading = false;
	let error = '';
	let create_visible = false;
	
	/** @type {import('$src/types/firmware').NewFirmware} */
	let new_item = { version: '', enabled: false, stable: false, name: '' };

	/** @type {import('src/types/firmware').EditFirmware | null} */
	let edit_item = null;

	/** @type {FileList} */
	let files;

	function showhide_create(v = true) {
		return () => (create_visible = v);
	}

	/** @type {import('src/types/firmware').ShowHideEditFn} */
	async function showhide_edit(v = null) {
		loading = true;
		let url = '';
		if (v) {
			const info = await fetch('/api/updates/' + v.id);
			url = (await info.json()).fileUrl ?? '';
			edit_item = { ...v, url };
		} else {
			edit_item = null;
		}
		loading = false;
	}

	async function create_update() {
		error = '';
		if (!files || !files.length || !new_item.version || !new_item.name) {
			error = 'validation';
			return;
		}
		const input = new FormData();
		input.append('file', files[0]);
		input.append('version', new_item.version);
		input.append('name', new_item.name);
		input.append('enabled', new_item.enabled.toString());
		input.append('stable', new_item.stable.toString());

		loading = true;
		const { status } = await fetch('/api/updates', {
			method: 'POST',
			body: input
		});
		loading = false;
		if (status !== 201) {
			error = 'create';
		} else {
			create_visible = false;
			new_item = { version: '', enabled: false, stable: false, name: '' };
			invalidateAll();
		}
	}

	async function edit_update() {
		error = '';
		if (!edit_item || Number.isNaN(edit_item.id) || !edit_item.name) {
			error = 'validation';
			return;
		}
		const input = new FormData();
		input.append('enabled', edit_item.enabled.toString());
		input.append('name', edit_item.name);

		loading = true;
		const { status } = await fetch('/api/updates/' + edit_item.id, {
			method: 'PUT',
			body: input
		});
		loading = false;
		if (status !== 200) {
			error = 'edit';
		} else {
			edit_item = null;
			invalidateAll();
		}
	}

	/** @type {(timestamp: number) => string} */
	function displayTimestamp(timestamp) {
  		// Date from timestamp which is converted to ms from s
  		const date = new Date(timestamp * 1000);

		const year = date.getFullYear();
		const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-based
		const day = ("0" + date.getDate()).slice(-2);
		const hours = ("0" + date.getHours()).slice(-2);
		const minutes = ("0" + date.getMinutes()).slice(-2);
		const seconds = ("0" + date.getSeconds()).slice(-2);

		// Format the date and time
		const formattedDate = `${day}-${month}-${year}`;
		const formattedTime = `${hours}:${minutes}:${seconds}`;

		return `${formattedDate} ${formattedTime}`;
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if create_visible}
	<div class="modal" on:click={showhide_create(false)} role="presentation">
		<div on:click|stopPropagation role="presentation">
			<h2>Publish a Firmware Update</h2>
			<div>
				<p>Name of the firmware</p>
				<input class="string" bind:value={new_item.name} />
			</div>
			<div>
				<p>Version name</p>
				<input class="string" bind:value={new_item.version} />
			</div>
			<div>
				<p>Set as enabled</p>
				<label class="switch">
					<input type="checkbox" bind:checked={new_item.enabled} />
					<span class="slider" />
				</label>
			</div>
			<div>
				<p>Tag as stable release</p>
				<label class="switch">
					<input type="checkbox" bind:checked={new_item.stable} />
					<span class="slider" />
				</label>
			</div>
			<div class="file">
				<p>Upload the firmware</p>
				<input bind:files id="firmware" name="firmware" type="file" />
			</div>
			<button class="close" on:click={showhide_create(false)}>
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
{#if edit_item}
	<div class="modal" on:click={() => void showhide_edit(null)} role="presentation">
		<div on:click|stopPropagation role="presentation">
			<h2>Edit Firmware Update</h2>
			<div>
				<p>id</p>
				<input class="string" value={edit_item.id} disabled />
			</div>
			<div>
				<p>name</p>
				<input class="string full" bind:value={edit_item.name} />
			</div>
			<div>
				<p>uploader</p>
				<input class="string full" value={edit_item.uploader} disabled />
			</div>
			<div>
				<p>hash</p>
				<input class="string full" value={edit_item.hash} disabled />
			</div>
			<div>
				<p>Set as enabled</p>
				<label class="switch">
					<input type="checkbox" bind:checked={edit_item.enabled} />
					<span class="slider" />
				</label>
			</div>
			<div>
				<button class="publish" style="margin:auto auto 0 0">
					<a href={edit_item.url} target="_blank" download>
						Download <span class="material-symbols-outlined">&#xf090</span>
					</a>
					{#if loading}
						<div class="loader" />
					{/if}
				</button>
				<button class="publish" on:click={edit_update}>
					Save changes <span class="material-symbols-outlined">&#xe255</span>
					{#if loading}
						<div class="loader" />
					{/if}
				</button>
			</div>
			{#if error === 'validation'}
				<p style="color:red;">Input validation failed. Fill out all fields.</p>
			{/if}
			{#if error === 'edit'}
				<p style="color:red;">Failed to edit upload. Try again later.</p>
			{/if}
		</div>
	</div>
{/if}
<h1>Dashboard</h1>
<div class="top-section">
	<p>Total count of updates: {data?.updates?.length || 0}</p>
	<button class="create" on:click={showhide_create()}>
		Create Update <span class="material-symbols-outlined">&#xe2c3</span>
	</button>
</div>
<table>
	<tr>
		<th class="small" style="width: auto;">ID</th>
		<th>Name</th>
		<th>Version</th>
		<th>Uploader</th>
		<th>Hash</th>
		<th class="small">Enabled</th>
		<th class="small">Stable</th>
		<th>Timestamp</th>
	</tr>
	{#if data?.updates?.length}
		{#each data.updates as { id, version, uploader, hash, enabled, stable, timestamp, name }}
			<tr on:click={() => void showhide_edit({ id, hash, enabled, name, uploader })}>
				<td>{id}</td>
				<td>{name}</td>
				<td>{version}</td>
				<td>{uploader}</td>
				<td>{hash}</td>
				<td class="small">
					{#if enabled}
						<span class="material-symbols-outlined">&#xe5ca</span>
					{:else}
						<span class="material-symbols-outlined">&#xe5cd</span>
					{/if}
				</td>
				<td class="small">
					{#if stable}
						<span class="material-symbols-outlined">&#xe5ca</span>
					{:else}
						<span class="material-symbols-outlined">&#xe5cd</span>
					{/if}
				</td>
				<td>{displayTimestamp(timestamp)}</td>
			</tr>
		{/each}
	{/if}
	{#if !data.updates?.length}
		<tr>
			<td colspan="8" class="c">No data</td>
		</tr>
	{/if}
</table>
{#if loading}
	<div id="abs-loader">
		<div class="loader" />
	</div>
{/if}
<style>
	#abs-loader {
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
	input.string {
		border: none;
		height: 30px;
		border-radius: 5px;
		width: 250px;
		padding: 5px 15px;
		font-size: 16px;
		font-family: Roboto;
	}
	input.string.full {
		width: 500px;
	}
	td.small, th.small {
		width: 80px;
		text-align: center;
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
	button > a, button > a:hover, button > a:visited, button > a:active {
		color: white;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
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
	button > span, button > a > span {
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
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
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
		cursor: pointer;
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
