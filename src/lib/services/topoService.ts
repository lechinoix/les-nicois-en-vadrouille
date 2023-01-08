import type { CamptocampRoute } from '$lib/camptocamp';
import { topoSources } from '$lib/constants';
import type { TopoDetails, TopoSource } from '$lib/types';

export const findTopoSourceFromLink = (topoLink: string): TopoSource | undefined =>
	Object.values(topoSources)?.find((topoSource) => topoLink.includes(topoSource.webDomain));

export const getTopoDetails = async (topoUrl: string): Promise<TopoDetails | null> => {
	const topoSource = findTopoSourceFromLink(topoUrl);

	if (topoSource?.id === 'C2C') return await extractC2CInfo(topoUrl);

	return null;
};

const extractC2CInfo = async (topoUrl: string): Promise<TopoDetails | null> => {
	const routeId = topoUrl.replace('https://www.camptocamp.org/routes/', '').split('/')[0];

	const result = await fetch(`${topoSources.C2C.apiBaseUrl}/routes/${routeId}`);

	const camptocampInfo: CamptocampRoute = await result.json();

	return {
		elevation: camptocampInfo.height_diff_difficulties,
		cotation: [
			camptocampInfo.global_rating,
			`${camptocampInfo.rock_free_rating}>${camptocampInfo.rock_required_rating}`,
			camptocampInfo.engagement_rating,
			camptocampInfo.risk_rating,
			camptocampInfo.equipment_rating
		].join(' '),
		orientation: camptocampInfo.orientations[0]
	};
};
