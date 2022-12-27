<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal: HTMLElement;

	const handle_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll<HTMLElement>('*');
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement as HTMLElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused =
		typeof document !== 'undefined' && (document.activeElement as HTMLElement);

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background" on:click={close} on:scroll|stopPropagation>
	<div on:click|stopPropagation class="modal" role="dialog" aria-modal="true" bind:this={modal}>
		<slot name="header" />
		<hr />
		<slot />
	</div>
</div>

<style scoped>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 100;
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		padding: 1em;
		border-radius: 0.2em;
		background: white;
	}

	button {
		display: block;
	}
</style>
