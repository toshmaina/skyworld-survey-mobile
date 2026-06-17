/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/surveys` | `/(auth)/login` | `/_sitemap` | `/login` | `/surveys`;
      DynamicRoutes: `/(app)/surveys/${Router.SingleRoutePart<T>}` | `/(app)/surveys/${Router.SingleRoutePart<T>}/respond` | `/surveys/${Router.SingleRoutePart<T>}` | `/surveys/${Router.SingleRoutePart<T>}/respond`;
      DynamicRouteTemplate: `/(app)/surveys/[id]` | `/(app)/surveys/[id]/respond` | `/surveys/[id]` | `/surveys/[id]/respond`;
    }
  }
}
