import config from '@/config';
import { AnyObject, convertToFormData, fetchUtil, triggerFormData, triggerKeyValue } from '@/utils/utils';
import { useMutation } from '@tanstack/react-query';

const updateProvider = async (payload: AnyObject) => {
	payload.action = 'update_email_config';
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useUpdateProvider = () => {
	return useMutation({
		mutationFn: updateProvider,
		onError: (error: any) => {
			console.log('mutaion error', error);
		},
	});
};
