/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as chat from "../chat.js";
import type * as contact from "../contact.js";
import type * as fixSiteConfig from "../fixSiteConfig.js";
import type * as gallery from "../gallery.js";
import type * as http from "../http.js";
import type * as migrateAdminData from "../migrateAdminData.js";
import type * as notices from "../notices.js";
import type * as resetSiteConfig from "../resetSiteConfig.js";
import type * as router from "../router.js";
import type * as storage from "../storage.js";
import type * as teachers from "../teachers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  chat: typeof chat;
  contact: typeof contact;
  fixSiteConfig: typeof fixSiteConfig;
  gallery: typeof gallery;
  http: typeof http;
  migrateAdminData: typeof migrateAdminData;
  notices: typeof notices;
  resetSiteConfig: typeof resetSiteConfig;
  router: typeof router;
  storage: typeof storage;
  teachers: typeof teachers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
