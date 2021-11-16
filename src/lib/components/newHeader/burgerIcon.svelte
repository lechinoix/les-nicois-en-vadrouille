<script lang="ts">
	export let isOpen = false;
	export let onClick: (el: any) => void;
	export let ratio = 3;

	let lineHeight = `${ratio}px`;
	let width = `${ratio * 10}px`;
</script>

<button class:opened={isOpen} on:click={onClick} style="--lineHeight:{lineHeight};--width:{width}">
	<span />
	<span />
	<span />
</button>

<style>
	button {
		display: flex;
		flex-direction: column;
		cursor: pointer;
		width: var(--width);
	}

	button span {
		background: #fff;
		border-radius: 10px;
		height: var(--lineHeight);
		margin: var(--lineHeight) 0;
		transition: 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
	}

	span:nth-of-type(1) {
		width: 50%;
	}

	span:nth-of-type(2) {
		width: 100%;
	}

	span:nth-of-type(3) {
		width: 75%;
	}

	button.opened > span:nth-of-type(1) {
		transform-origin: bottom;
		transform: rotatez(45deg) translate(8px, 0px);
	}

	button.opened > span:nth-of-type(2) {
		transform-origin: top;
		transform: rotatez(-45deg);
	}

	button.opened > span:nth-of-type(3) {
		transform-origin: bottom;
		width: 50%;
		transform: translate(30px, -11px) rotatez(45deg);
	}
</style>
