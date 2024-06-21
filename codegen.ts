import dotenv from 'dotenv';
dotenv.config();
import type { CodegenConfig } from '@graphql-codegen/cli';
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset';

const config: CodegenConfig = {
	schema: {
		'https://mxhdhwaoueiiehyajavu.supabase.co/graphql/v1': {
			headers: {
				apiKey: process.env.SUPABASE_SERVICE_KEY ?? ''
			}
		}
	}, // Using the local endpoint, update if needed
	documents: 'src/**/*.ts',
	overwrite: true,
	ignoreNoDocuments: true,
	generates: {
		'src/gql/': {
			preset: 'client',
			presetConfig: {
				fragmentMasking: false
			},
			documentTransforms: [addTypenameSelectionDocumentTransform],
			plugins: [],
			config: {
				scalars: {
					UUID: 'string',
					Date: 'string',
					Time: 'string',
					Datetime: 'string',
					JSON: 'string',
					BigInt: 'string',
					BigFloat: 'string',
					Opaque: 'any'
				}
			}
		}
	}
};

export default config;
