export const endpoints = {
	SETTINGS: '/trigger-settings',
	GET_SETTINGS: `/settings`,
	DELETE_SETTINGS: (id) => `/settings/delete/${id}`,
	CREATE_SETTINGS: `/settings/create`,
	UPDATE_SETTINGS: (id) => `/settings/update/${id}`,
};
