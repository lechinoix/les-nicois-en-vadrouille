<script lang="ts">
	import Input from '$lib/components/form/input.svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';
	import { getSecrets, setPassword } from '$lib/services/secretsService';

	let password: string = '';
	let error: boolean = false;

	const submitPassword = () => {
		error = false;
		setPassword(password);
		try {
			if (!getSecrets().githubToken) {
				error = true;
			}
		} catch {
			error = true;
		}
	};
</script>

<Input type="text" label="Password" name="password" bind:value={password} />
<LinkButton onClick={submitPassword}>Sumbit</LinkButton>
{#if error}<p class="text-red-700">Wrong password</p>{/if}
