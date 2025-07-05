export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "http://localhost:8747/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`; 
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`; // Correct the endpoint URL
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`; // Add this for image deletion
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const CONTACTS_ROUTES = "http://localhost:8747/api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`;


  export const MESSAGES_ROUTES = "http://localhost:8747/api/messages";
  export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`; 
  export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

