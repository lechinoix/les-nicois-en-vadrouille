<script context="module">
	export const prerender = true;
	export async function load({ page }) {
		const adventure = await getAdventureById(page.params.id);
		return {
			props: { adventure }
		};
	}
</script>

<script lang="ts">
	import type { Adventure, Picture, Comment } from '$lib/types';
	import { page } from '$app/stores';
	import marked from 'marked';
	import Slider from '$lib/components/slider.svelte';
	import TopoLink from '$lib/components/topoLink.svelte';
	import AdventureCard from '$lib/components/adventureCard.svelte';
	import { getAdventureById } from '$lib/services/adventureService';
	import Container from '$lib/components/container.svelte';
	import { formatFrenchDate } from '$lib/utils/date';
	import { slugify, truncateText } from '$lib/utils/string';
	import { getUrlWithNewSlug } from '$lib/utils/url';
	import { browser } from '$app/env';
	import CommentForm from '$lib/components/comments/commentForm.svelte';
	import CommentBox from '$lib/components/comments/commentBox.svelte';
	import uniqBy from 'lodash/uniqBy';

	export let adventure: Adventure;

	let picture: Picture;
	let adventureSlug: string;
	let pageUrl: string;
	let isCreatingComment = false;
	let comments: Comment[] = [];

	const openCommentCreation = () => {
		isCreatingComment = true;
	};

	const onCommentSave = (comment: Comment) => {
		isCreatingComment = false;
		comments = [...comments, comment];
	};

	$: {
		adventureSlug = slugify(adventure.title);
		if (browser) pageUrl = getUrlWithNewSlug(location, adventureSlug);
		if (browser && $page.params.slug !== adventureSlug)
			window.history.replaceState(null, null, pageUrl);
	}

	$: picture = adventure.cover_picture?.picture || adventure.pictures[0];

	$: comments = uniqBy([...comments, ...adventure.comments], 'id');
</script>

<svelte:head>
	<meta property="og:image" content={picture.formats.medium.url} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={adventure.title} />
	<meta
		property="og:description"
		content={adventure.short_description || truncateText(adventure.description)}
	/>
</svelte:head>

<AdventureCard {adventure} />
<Container>
	<p class="text-justify text-gray-800 text-xl font-sans font-thin leading-relaxed">
		{#if adventure.date}
			<span class="italic">{formatFrenchDate(adventure.date)}</span>
			<br />
			<br />
		{/if}
		<span>{@html marked(adventure.description || '')}</span>
	</p>
	<br />
	<br />
	{#if adventure.topo?.length > 0}
		<b>Topo</b> :
		{#each adventure.topo as topo}
			<TopoLink {topo} />
			<br />
		{/each}
	{/if}
	{#if adventure.pictures?.length > 0}
		<div class="mt-5" id="slider">
			<Slider pictures={adventure.pictures} />
		</div>
	{/if}

	<div class="w-full mt-10">
		<h2 class="text-2xl">Commentaires</h2>
		{#if comments.length > 0}
			{#each comments as comment}
				<div class="my-5">
					<CommentBox {comment} />
				</div>
			{/each}
		{:else}
			No comment for the moment
		{/if}
		{#if !isCreatingComment}
			<button class="block p-2 bg-gray-200 border border-gray-600" on:click={openCommentCreation}
				>Post comment</button
			>
		{:else}
			<CommentForm adventureId={adventure.id} onSuccess={onCommentSave} />
		{/if}
	</div>
</Container>
