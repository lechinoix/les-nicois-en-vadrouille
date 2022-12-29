<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import Input from '$lib/components/form/input.svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { checkIsLoggedIn, getSecrets, setPassword } from '$lib/services/secretsService';

	let isLoggedIn: boolean;
	let password: string = '';
	let error: boolean = false;

	isLoggedIn = checkIsLoggedIn();

	const submitPassword = () => {
		error = false;
		setPassword(password);
		if (checkIsLoggedIn()) {
			isLoggedIn = true;
		} else {
			error = true;
		}
	};
</script>

<Container>
	<head class="h-16 flex flex-start items-center justify-center font-semibold">
		<a href="/editor">Les Nicois en Vadrouille - Backoffice</a>
	</head>
</Container>
<div class="mt-8 mb-20">
	{#if isLoggedIn}
		<slot />
	{:else}
		<Container>
			<Input type="text" label="Password" name="password" bind:value={password} />
			<LinkButton onClick={submitPassword}>Sumbit</LinkButton>
			{#if error}<p class="text-red-700">Wrong password</p>{/if}
		</Container>
	{/if}
</div>
