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
	import uniqBy from 'lodash/uniqBy.js';
	import findIndex from 'lodash/findIndex.js';
	import { typography } from '$lib/styles';
	import { sliderRef } from '$lib/stores/slider';

	export let adventure: Adventure;

	let coverPicture: Picture;
	let adventureSlug: string;
	let pageUrl: string;
	let isCreatingComment = false;
	let comments: Comment[] = [];
	let pictures: Picture[];

	$: {
		adventureSlug = slugify(adventure.title);
		if (browser) pageUrl = getUrlWithNewSlug(location, adventureSlug);
		if (browser && $page.params.slug !== adventureSlug)
			window.history.replaceState(null, null, pageUrl);
	}
	$: coverPicture = adventure.cover_picture?.picture || adventure.pictures[0];
	$: pictures = uniqBy([coverPicture, ...adventure.pictures], 'id');
	$: comments = uniqBy([...comments, ...adventure.comments], 'id').filter(
		(comment) => !comment.blocked
	);

	const openCommentCreation = () => {
		isCreatingComment = true;
	};

	const onCommentSave = (comment: Comment) => {
		isCreatingComment = false;
		comments = [...comments, comment];
	};

	const openSlider = () => {
		sliderRef.subscribe((gallery) =>
			gallery.openGallery(findIndex(pictures, ['id', coverPicture.id]))
		);
	};
</script>

<svelte:head>
	<meta property="og:image" content={coverPicture.formats.medium.url} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={adventure.title} />
	<meta
		property="og:description"
		content={adventure.short_description || truncateText(adventure.description)}
	/>
</svelte:head>

<AdventureCard {adventure} onClick={openSlider} />
<Container>
	<p class={`text-justify ${typography.text}`}>
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
			<Slider {pictures} />
		</div>
	{/if}

	<div class="w-full mt-10">
		<h2 class="text-2xl">Commentaires</h2>
		{#if comments.length > 0}
			{#each comments as comment}
				<div class="my-5">
					<CommentBox {comment} adventureId={adventure.id} />
				</div>
			{/each}
		{/if}
		{#if !isCreatingComment}
			<button
				class="block px-3 py-2 border border-gray-600 text-gray-600 rounded-md mt-5"
				on:click={openCommentCreation}>Commenter</button
			>
		{:else}
			<CommentForm adventureId={adventure.id} onSuccess={onCommentSave} />
		{/if}
	</div>
</Container>
