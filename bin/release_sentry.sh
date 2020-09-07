#/bin/bash

curl -sL https://sentry.io/get-cli/ | bash
sentry-cli releases new -p $SENTRY_PROJECT_NAME $SENTRY_RELEASE_VERSION
sentry-cli releases -p $SENTRY_PROJECT_NAME files $SENTRY_RELEASE_VERSION upload-sourcemaps .nuxt/dist/client --rewrite --url-prefix '~/_nuxt/'
# TODO: Sentry の Repository integration を ON にすること
# sentry-cli releases set-commits --auto $SENTRY_RELEASE_VERSION
sentry-cli releases finalize $SENTRY_RELEASE_VERSION
sentry-cli releases deploys $SENTRY_RELEASE_VERSION new -e production
