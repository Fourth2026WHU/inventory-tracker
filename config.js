// Connection details for this app's Supabase project.
// Both values are meant to be public: the rules in supabase/schema.sql protect the data.
// NEVER put the secret or service_role key here. It would give anyone full access.
const SUPABASE_URL = "https://oreqkgjcycbhmublooxu.supabase.co";
const SUPABASE_KEY = "sb_publishable_JIb3pGcxffEU65eDdlqmWA_O6GpFTLV";

// Supabase logs in with an email address, so each username becomes username + this ending.
// No email is ever sent to these addresses.
const LOGIN_EMAIL_ENDING = "@inventory.invalid";
