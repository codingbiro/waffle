<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Information</title>
</svelte:head>

<h1>Information</h1>

<h3>Account address</h3>
<p>{data.info.account.address}</p>

<h3>Configuration</h3>

<h4>Contract Name</h4>
<p>{data.info.config.contractName}</p>

<h4>Contract Address</h4>
<p>{data.info.config.deployedAddress}</p>

<h4>Ether network address</h4>
<p>{data.info.config.networkAddress}</p>

<h3>GitHub Repository</h3>
<a href="https://github.com/codingbiro/waffle" target="_blank">codingbiro/waffle</a>
<h3>Author</h3>
<a href="https://birovince.com" target="_blank">Vince Biro</a>

<style>
	:root {
		text-align: center;
		margin-top: 20px;
	}
	h1 {
		margin-bottom: 40px;
	}
	h3 {
		margin-top: 50px;
	}
</style>
