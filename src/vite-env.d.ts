/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// TODO: revisit types

interface IdConfiguration {
  client_id?: string | undefined;
  auto_select?: boolean | undefined;
  callback?: ((credentialResponse: CredentialResponse) => void) | undefined;
  login_uri?: string;
  native_callback?: (() => void) | undefined;
  cancel_on_tap_outside?: boolean | undefined;
  prompt_parent_id?: string | undefined;
  nonce?: string | undefined;
  context?: string | undefined;
  state_cookie_domain?: string | undefined;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[] | undefined;
  intermediate_iframe_close_callback?: (() => void) | undefined;
  itp_support?: boolean;
}

interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}

interface GsiButtonConfiguration {
  type: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signup_with';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  local?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface TokenResponse {
  /** The access token of a successful token response. */
  access_token: string;

  /** The lifetime in seconds of the access token. */
  expires_in: string;

  /** The hosted domain the signed-in user belongs to. */
  hd?: string;

  /** The prompt value that was used from the possible list of values specified by TokenClientConfig or OverridableTokenClientConfig */
  prompt: string;

  /** The type of the token issued. */
  token_type: string;

  /** A space-delimited list of scopes that are approved by the user. */
  scope: string;

  /** The string value that your application uses to maintain state between your authorization request and the response. */
  state?: string;

  /** A single ASCII error code. */
  error?:
    | 'invalid_request'
    | 'access_denied'
    | 'unauthorized_client'
    | 'unsupported_response_type'
    | 'invalid_scope'
    | 'server_error'
    | 'temporarily_unavailable';

  /**	Human-readable ASCII text providing additional information, used to assist the client developer in understanding the error that occurred. */
  error_description?: string;

  /** A URI identifying a human-readable web page with information about the error, used to provide the client developer with additional information about the error. */
  error_uri?: string;
}

interface CodeResponse {
  code: string;
  scope: string;
  state?: string;
  error?: string; // TODO: make a type for ascii errors
  error_description?: string;
  error_uri?: string;
}

interface CodeClientConfig<TResponse> {
  /**
   *  The client ID for your application. You can find this value in the
   *  [API Console](https://console.cloud.google.com/apis/dashboard).
   */
  client_id: string;

  /**
   * A space-delimited list of scopes that identify the resources
   * that your application could access on the user's behalf.
   * These values inform the consent screen that Google displays to the user.
   */
  scope: string;

  /**
   * Required for redirect UX. Determines where the API server redirects
   * the user after the user completes the authorization flow.
   * The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client,
   * which you configured in the API Console and must conform to our
   * [Redirect URI validation rules](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation).
   * The property will be ignored by the popup UX.
   */
  redirect_uri?: string;

  /**
   * Required for popup UX. The JavaScript function name that handles returned code response.
   * The property will be ignored by the redirect UX
   */
  callback: (response: TResponse) => void;

  /**
   * 	Optional. Recommended for redirect UX.
   * Specifies any string value that your application uses to maintain
   * state between your authorization request and the authorization server's response.
   */
  state?: string;
  enable_serial_consent?: string;
  hint?: string;
  hosted_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  select_account?: boolean;
}

interface OverridableTokenClientConfig {
  prompt?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  state?: string;
  scope?: string;
}
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (input: IdConfiguration) => void;
        prompt: (
          momentListener?: (
            promptMomentNotification: PromptMomentNotification,
          ) => void,
        ) => void;
        renderButton: (
          parent: HTMLElement,
          options: GsiButtonConfiguration,
          clickHandler?: () => void,
        ) => void;
        disableAutoSelect: () => void;
        // storeCredential: Function<{
        //   credentials: { id: string; password: string };
        //   callback: Function;
        // }>;
        cancel: () => void;
        onGoogleLibraryLoad: Function;
        revoke: (accessToken: string, done: () => void) => void;
      };
      oauth2: {
        initTokenClient: (config: CodeClientConfig<TokenResponse>) => {
          requestAccessToken: (
            overridableClientConfig?: OverridableTokenClientConfig,
          ) => void;
        };
        initCodeClient: (config: CodeClientConfig<CodeResponse>) => {
          requestAccessToken: (
            overridableClientConfig?: OverridableTokenClientConfig,
          ) => void;
        };
        hasGrantedAnyScope: (
          tokenRsponse: TokenResponse,
          ...scopes: string[]
        ) => void;
        hasGrantedAllScopes: (
          tokenRsponse: TokenResponse,
          ...scopes: string[]
        ) => void;
        revoke: (accessToken: string, done?: () => void) => void;
      };
    };
  };
}
