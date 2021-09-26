<script lang="typescript">
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import { formatAssetUrl } from '$lib/services/adventureService';
import type { Picture } from '$lib/types';

export let pictures: Picture[] = [];
export let galleryName: string = 'lightgallery';

lightGallery(document.getElementById('lightgallery'), {
    plugins: [lgZoom, lgThumbnail],
    speed: 500
});
</script>

<div id="{galleryName}">
  {#each pictures as picture}
  <a data-lg-size="{`${picture.width}-${picture.height}`}">
      <img alt="{picture.alternativeText}" src="{formatAssetUrl(picture.url)}" />
  </a>
  {/each}
</div>

<style>
  @import 'lightgallery/css/lightgallery.css';
  @import 'lightgallery/css/lg-zoom.css';
  @import 'lightgallery/css/lg-thumbnail.css';
</style>
