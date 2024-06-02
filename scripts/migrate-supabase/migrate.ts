import rawAdventuresData from '../../src/lib/data/adventure_data.json' assert { type: "json" };
import rawAdventuresContent from '../../src/lib/data/adventure_content.json' assert { type: "json" };
import type { AdventureData, AdventureContent } from '../../src/lib/types';
import type { Database } from '../../src/lib/database.types';
import _ from 'lodash';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxhdhwaoueiiehyajavu.supabase.co';
const adminSupabaseKey = '' // Replace with value

export const adminSupabase = createClient<Database>(supabaseUrl, adminSupabaseKey);

// eslint-disable-next-line
// @ts-ignore
export const adventuresData: AdventureData[] = rawAdventuresData;
// eslint-disable-next-line
// @ts-ignore
export const adventuresContent: AdventureContent[] = rawAdventuresContent;

const run = async () => {
	for (const adventure of adventuresData) {
		console.log(`Importing adventure ${adventure.id}: ${adventure.title}`)
		const adventureContent = adventuresContent.find((content) => content.id === adventure.id);

		const outingContent: Database['public']['Tables']['outing']['Insert'] = {
			content: adventureContent?.content,
			cotation: adventure.cotation,
			date: adventure.date,
			elevation: adventure.elevation,
			orientation: adventure.orientation,
			id: adventure.id,
			topos: adventureContent?.topos,
			title: adventure.title
		};

		const { error, data: outingResponse } = await adminSupabase
			.from('outing')
			.insert([outingContent])
			.select();
		if (error) console.log(error);

		const createdOuting = _.first(outingResponse) as Database['public']['Tables']['outing']['Row'];

		if (adventure.participants && adventure.participants.length > 0) {
			for (const participant of adventure.participants) {
				const { data: participantResponse, error } = await adminSupabase
					.from('participant')
					.select('id')
					// Filters
					.ilike('surname', `%${participant}%`);

				if (error) console.log(error);

				const participantId = (_.first(participantResponse) as { id: string } | null)?.id;

				if (participantId) {
					const outingParticipantContent: Database['public']['Tables']['outing_participant']['Insert'] =
						{
							participant_id: participantId,
							outing_id: createdOuting.id
						};
					const { error } = await adminSupabase
						.from('outing_participant')
						.insert([outingParticipantContent]);
					if (error) console.log(error);
				}
			}
		}

		if (adventure.sports && adventure.sports.length > 0) {
			for (const sport of adventure.sports) {
				const { data: sportResponse, error } = await adminSupabase
					.from('sport')
					.select('id')
					// Filters
					.ilike('key', `%${sport}%`);

				if (error) console.log(error);

				const sportId = (_.first(sportResponse) as { id: string } | null)?.id;

				if (sportId) {
					const outingSportContent: Database['public']['Tables']['outing_sport']['Insert'] = {
						sport_id: sportId,
						outing_id: createdOuting.id
					};
					const { error } = await adminSupabase.from('outing_sport').insert([outingSportContent]);
					if (error) console.log(error);
				}
			}
		}

		if (adventure.periods && adventure.periods.length > 0) {
			for (const period of adventure.periods) {
				const { data: periodResponse, error } = await adminSupabase
					.from('period')
					.select('id')
					// Filters
					.ilike('key', `%${period}%`);

				if (error) console.log(error);

				const periodId = (_.first(periodResponse) as { id: string } | null)?.id;

				if (periodId) {
					const outingPeriodContent: Database['public']['Tables']['outing_period']['Insert'] = {
						period_id: periodId,
						outing_id: createdOuting.id
					};
					const { error } = await adminSupabase.from('outing_period').insert([outingPeriodContent]);
					if (error) console.log(error);
				}
			}
		}

		if (adventure.places && adventure.places.length > 0) {
			for (const place of adventure.places) {
				const { data: placeResponse, error } = await adminSupabase
					.from('place')
					.select('id')
					// Filters
					.ilike('key', `%${place}%`);
				if (error) console.log(error);

				const placeId = (_.first(placeResponse) as { id: string } | null)?.id;

				if (placeId) {
					const outingPlaceContent: Database['public']['Tables']['outing_place']['Insert'] = {
						place_id: placeId,
						outing_id: createdOuting.id
					};
					const { error } = await adminSupabase.from('outing_place').insert([outingPlaceContent]);
					if (error) console.log(error);
				}
			}
		}

		if (adventureContent?.pictures && adventureContent.pictures.length > 0) {
			for (const image of adventureContent.pictures) {
				const isCover = image.id === adventure.cover?.id;
				const imageContent: Database['public']['Tables']['image']['Insert'] = {
					url: image.url,
					height: image.height,
					width: image.width
				};
				const { data: imageResponse, error } = await adminSupabase
					.from('image')
					.insert([imageContent])
					.select();
				if (error) console.log(error);

				const createdImage = _.first(imageResponse) as Database['public']['Tables']['image']['Row'];

				if (isCover) {
					const { error } = await adminSupabase
						.from('outing')
						.update({ cover_id: createdImage.id })
						.eq('id', createdOuting.id);

					if (error) console.log(error);
				}

				const outingImageContent: Database['public']['Tables']['outing_image']['Insert'] = {
					image_id: createdImage.id,
					outing_id: createdOuting.id
				};
				const { error: error2 } = await adminSupabase
					.from('outing_image')
					.insert([outingImageContent]);
				if (error2) console.log(error2);

				const { error: error3 } = await adminSupabase
					.from('image_format')
					.insert(
						Object.entries(image.formats).filter((entry => entry[1].url !== null)).map(([format, imageFormat]) => {
							return {
								url: imageFormat.url,
								height: imageFormat.height,
								width: imageFormat.width,
								format,
								image_id: createdImage.id
							};
						})
					)
					.select();
				if (error3) console.log(error3);
			}
		}
	}
};

run();
