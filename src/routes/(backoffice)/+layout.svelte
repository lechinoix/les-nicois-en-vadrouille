<script lang="ts">
	import Input from '$lib/components/form/input.svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { getSecrets, setPassword } from '$lib/services/secretsService';

	let isLoggedIn: boolean;
	let password: string = '';
	let error: boolean = false;

	try {
		isLoggedIn = getSecrets().isLoggedIn;
	} catch {
		isLoggedIn = false;
	}

	const submitPassword = () => {
		error = false;
		setPassword(password);
		try {
			if (getSecrets().isLoggedIn) {
				isLoggedIn = true;
			} else {
				error = true;
			}
		} catch {
			error = true;
		}
	};
</script>

<div class="mt-8 mb-20">
	{#if isLoggedIn}
		<slot />
	{:else}
		<Input type="text" label="Password" name="password" bind:value={password} />
		<LinkButton onClick={submitPassword}>Sumbit</LinkButton>
		{#if error}<p class="text-red-700">Wrong password</p>{/if}
	{/if}
</div>
