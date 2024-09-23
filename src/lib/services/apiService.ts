import axios, { type AxiosRequestConfig } from "axios";
import { getSecrets } from "./secretsService";

export const createApiClient = () => <Payload, Response = any>(config: AxiosRequestConfig<Payload>) => axios<Response>({
	...config,
	headers: {
		...(config.headers ?? {}),
		Authorization: `Bearer ${getSecrets().apiKey}`,
	}
})
