<script lang="ts">
	import Container from '$lib/components/container.svelte';
	import { supabase } from '$lib/supabaseClient';
	import Input from '$lib/components/form/input.svelte';
	import LinkButton from '$lib/components/ui/linkButton.svelte';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<Container paddingHeader={true}>
	<form class="flex flex-col gap-2 mt-5">
		<div>
			<Input
				type="text"
				name="email"
				label="Entrez votre email pour recevoir un lien de connexion"
				placeholder="Votre email"
				bind:value={email}
			/>
		</div>
		<div>
			<LinkButton class="button block" disabled={loading} onClick={handleLogin}>
				{loading ? 'Loading' : 'Envoyer'}
			</LinkButton>
		</div>
	</form>
</Container>
