/**
 * {
 *    "document_id": 54904,
 *    "elevation_min": 600,
 *    "elevation_max": 874,
 *    "height_diff_up": 300,
 *    "height_diff_difficulties": 230,
 *    "orientations": ["SE"],
 *    "configuration": ["face"],
 *    "global_rating": "TD",
 *    "engagement_rating": "I",
 *    "risk_rating": null,
 *    "equipment_rating": "P1",
 *    "exposition_rock_rating": null,
 *    "rock_free_rating": "6c",
 *    "rock_required_rating": "6a+",
 *    "aid_rating": null,
 *    "rock_types": ["calcaire"],
 *    "climbing_outdoor_type": "multi"
 * }
 */

export type CamptocampRoute = {
	document_id: number;
	elevation_min: number;
	elevation_max: number;
	height_diff_up: number;
	height_diff_difficulties: number;
	orientations: string[];
	configuration: string[];
	global_rating: string | null;
	engagement_rating: string | null;
	risk_rating: string | null;
	equipment_rating: string | null;
	exposition_rock_rating: string | null;
	rock_free_rating: string | null;
	rock_required_rating: string | null;
	aid_rating: string | null;
	rock_types: string[];
	climbing_outdoor_type: string;
};
