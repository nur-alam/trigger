import config from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TriggerResponseType } from '@/utils/trigger-declaration';
import { fetchUtil } from '@/utils/requestUtils';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { AnyObject } from '@/utils/utils';

export const useGetAllProviders = () => {
	return useQuery<TriggerResponseType, Error>({
		queryKey: ['getAllProviders'],
		queryFn: async () => {
			const payload = {
				action: 'get_all_providers',
			};
			const res = await fetchUtil(`${config.rest_url}/connections`, {
				method: 'GET',
			});
			return res;
		},
		staleTime: 5000,
	});
};

export const useGetDefaultProvider = () => {
	return useQuery<TriggerResponseType, Error>({
		queryKey: ['getDefaultProvider'],
		queryFn: async () => {
			const res = await fetchUtil(`${config.rest_url}/get-default-connections`, {
				method: 'GET',
			});
			return res;
		},
		staleTime: 5000,
	});
};

const updateProvider = async (payload: AnyObject) => {
	payload.action = 'update_email_config';
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useUpdateProvider = () => {
	return useMutation({
		mutationFn: updateProvider,
		onSuccess: (response: TriggerResponseType) => {
			toast.success(response.message ?? __('Email configuration saved successfully!', 'trigger'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to save email configuration', 'trigger'));
		},
	});
};

export const useSendTestEmail = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload = { action: 'trigger_send_test_email', ...payload };
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		onSuccess: (response: TriggerResponseType) => {
			toast.success(response.message ?? __('Test email sent successfully!', 'trigger'));
		},
		onError: (error: any) => {
			toast.error(`asdkf ${error.message}` || __('asfd Failed to send test email', 'trigger'));
		},
	});
};

const connectWithGmail = async () => {
	const payload = {
		action: 'trigger_connect_with_gmail',
		trigger_nonce: config.nonce_value,
	};
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useConnectGmail = () => {
	return useMutation({
		mutationFn: connectWithGmail,
		onSuccess: (response: TriggerResponseType) => {
			window.location.href = response.data.auth_url;
		},
		onError: (error: any) => {
			toast.error(error.message || __('Failed to connect with Gmail. Please try again.', 'trigger'));
		},
	});
};

const isGmailConnected = async () => {
	const payload = {
		action: 'trigger_is_gmail_connected',
	};
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useIsGmailConnected = () => {
	return useMutation({
		mutationFn: isGmailConnected,
		onSuccess: (response: TriggerResponseType) => {},
		onError: (error: any) => {
			// toast.error(error.message || __('Failed to check connection. Please try again.', 'trigger'));
		},
	});
};

export const useGetSesVerifiedEmails = () => {
	return useQuery<TriggerResponseType, Error>({
		queryKey: ['getSesVerifiedEmails'],
		queryFn: async () => {
			const res = await fetchUtil(`${config.rest_url}/get-verified-ses-emails`, {
				method: 'GET',
				body: { provider: 'ses' },
			});
			return res;
		},
		staleTime: 0,
	});
};

export const useAwsVerifyEmail = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload = { action: 'verify_ses_email', ...payload };
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		onSuccess: (response: TriggerResponseType) => {
			toast.success(response.message ?? __('Email verified successfully!', 'trigger'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to verify email', 'trigger'));
		},
	});
};

export const useUpdateDefaultConnection = () => {
	return useMutation({
		mutationFn: async (payload: AnyObject) => {
			payload = { action: 'update_default_connection', ...payload };
			const res = await fetchUtil(config.ajax_url, { body: payload });
			return res;
		},
		onSuccess: (response: TriggerResponseType) => {
			toast.success(response.message ?? __('Default connection updated successfully!', 'trigger'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to update default connection', 'trigger'));
		},
	});
};
