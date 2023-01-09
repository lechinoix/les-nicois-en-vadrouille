<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabaseClient';
	import Container from '$lib/components/container.svelte';

	export let session: AuthSession;

	let loading = false;
	let name: string | null = null;

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { user } = session;

			const { data, error, status } = await supabase
				.from('profile')
				.select(`name`)
				.eq('id', user.id)
				.single();

			if (data) {
				name = data.name;
			}

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile() {
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				name
			};

			let { error } = await supabase.from('profile').upsert(updates);

			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<Container paddingHeader={true}>
	<form class="form-widget" on:submit|preventDefault={updateProfile}>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={session.user.email} disabled />
		</div>
		<div>
			<label for="username">Nom d'utilisateur</label>
			<input id="username" type="text" bind:value={name} />
		</div>

		<div>
			<input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Valider'}
				disabled={loading}
			/>
		</div>

		<div>
			<button class="button block" on:click={signOut} disabled={loading}>Se déconnecter</button>
		</div>
	</form>
</Container>
