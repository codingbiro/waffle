<nav>
	<p class="logo">Waffle</p>
	<a href="/dashboard"><span class="material-symbols-outlined">&#xe871</span> Dashboard</a>
	<p class="bottom">v0.0.1</p>
</nav>

<article>
	<slot />
</article>

<style>
	:root {
		font-family: 'Roboto', sans-serif;
	}
	nav {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 150px;
		z-index: 2;
		background-color: rgb(150, 120, 0);
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 20px;
	}
	article {
		margin-left: 140px;
		padding: 10px;
	}
	a,
	a:visited,
	a:active,
	a:hover {
		text-decoration: none;
		color: white;
		font-size: 16px;
		font-weight: 300;
		display: flex;
		align-items: center;
		& > span {
			margin-right: 5px;
		}
	}
	a:hover {
		opacity: 0.6;
	}
	p.logo {
		font-weight: 900;
		font-size: 20px;
		border-bottom: solid 1px black;
		margin-bottom: 40px;
	}
	p.bottom {
		margin-top: auto;
		font-weight: 300;
	}
</style>
