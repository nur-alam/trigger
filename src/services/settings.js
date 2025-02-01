import config from '@config/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@utils/endpoints';
import { fetchUtil } from '@utils/utils';
import toast from 'react-hot-toast';

async function getWordList(params) {
	const offset = (params.offset - 1) * params.limit;
	const order = params.order ?? '';
	const queryString = new URLSearchParams(params).toString();
	// const url = `http://trigger.test/wp-json/trigger/v1/words?offset=${offset}&limit=${params.limit}&search=${params.search}`;
	// const url = `${config.rest_url}${endpoints.GET_WORDS()}?${queryString}`;
	const url = `${endpoints.GET_WORDS}?offset=${offset}&limit=${params.limit}&search=${params.search}&order=${order}`;
	return await fetchUtil(url);
}

export const useWordListQuery = (params = { page: 1, limit: 10, search: '' }) => {
	return useQuery({
		queryKey: ['WordList'],
		queryFn: () => getWordList(params),
		// staleTime: 1000,
		retry: false,
		onError: (error) => {
			console.log('throwOnError', error);
		},
	});
};

async function createWord(payload = {}) {
	return await fetchUtil(endpoints.CREATE_WORD, {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export const useCreateWordMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createWord,
		onSuccess: () => {
			queryClient.invalidateQueries('WordList');
		},
	});
};

async function updateWord(payload = {}) {
	return await fetchUtil(endpoints.UPDATE_WORD(payload.id), {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'PUT',
		body: JSON.stringify(payload),
	});
}

export const useUpdateWordMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateWord,
		onSuccess: (data, variables, context) => {
			console.log('data', data);
			console.log('variables', variables);
			console.log('context', context);
			queryClient.invalidateQueries('WordList');
			toast.success('Word updated successfully!');
		},
		onError: (error) => {
			toast.error(`Failed to update!`);
			// toast.error(`Failed to update! ${error}`);
		},
	});
};

async function deleteWord(params = {}) {
	return await fetchUtil(endpoints.DELETE_WORD(params.id), {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'DELETE',
	});
}

export const useDeleteWordMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteWord,
		onSuccess: () => {
			queryClient.invalidateQueries(['WordList']);
			toast.success('Word deleted successfully!');
		},
	});
};
