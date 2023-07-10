<h1>Dashboard</h1>
<div class="top-section">
	<button>Create Update <span class="material-symbols-outlined">&#xe2c3</span></button>
</div>
<table>
	<tr>
		<th>Version</th>
		<th>Uploader</th>
		<th>Date</th>
		<th>Status</th>
	</tr>
	<tr>
		<td colspan="4">No data</td>
	</tr>
</table>

<style>
	div.top-section {
		display: flex;
		justify-content: flex-end;
		padding: 20px 50px;
	}
	h1 {
		text-align: center;
	}
	button {
		display: flex;
		align-items: center;
		& > span {
			margin-left: 10px;
		}
		padding: 5px 20px;
		text-transform: uppercase;
		font-family: Roboto, sans-serif;
		background-color: slategray;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 5px;
	}
	button:hover {
		opacity: 0.6;
	}
	table {
		font-family: Roboto, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}
	td,
	th {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	}
	td {
		text-align: center;
	}
	tr:nth-child(even) {
		background-color: #dddddd;
	}
</style>
