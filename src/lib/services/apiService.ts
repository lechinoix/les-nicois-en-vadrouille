import axios, { type AxiosRequestConfig } from "axios";
import { getSecrets } from "./secretsService";

export const createApiClient = () => <Payload>(config: AxiosRequestConfig<Payload>) => axios({
	...config,
	headers: {
		...(config.headers ?? {}),
		Authorization: `Bearer ${getSecrets().apiKey}`,
	}
})
