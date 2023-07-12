<script>
	import { page } from '$app/stores';
</script>

<nav>
	<img class="logo" src="/logo.png" width="100" alt="Waffle" />
	<a href="/dashboard" class:active={$page.url.pathname === '/dashboard'}>
		<span class="material-symbols-outlined">&#xe871</span> Dashboard
	</a>
	<a href="/information" class:active={$page.url.pathname === '/information'}>
		<span class="material-symbols-outlined">&#xe8b8</span> Information
	</a>
	<p class="bottom">v0.0.1</p>
</nav>

<article>
	<slot />
</article>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 160px;
		z-index: 2;
		background-color: #f1e66d;
		background: linear-gradient(#f1e66d, #f5e535);
		display: flex;
		flex-direction: column;
		text-align: center;
		padding-top: 20px;
	}
	article {
		margin-left: 160px;
		padding: 20px;
	}
	a,
	a:visited,
	a:active,
	a:hover {
		text-decoration: none;
		color: black;
		font-size: 16px;
		font-weight: 300;
		display: flex;
		align-items: center;
		& > span {
			margin-right: 5px;
		}
		margin-left: 20px;
		margin-bottom: 20px;
	}
	a:hover {
		opacity: 0.6;
	}
	a.active {
		font-weight: 900;
	}
	img.logo {
		margin: 20px auto 60px auto;
	}
	p.bottom {
		margin-top: auto;
		font-weight: 300;
	}
</style>
