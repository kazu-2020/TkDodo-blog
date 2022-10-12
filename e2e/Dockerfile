FROM cypress/browsers:node16.17.0-chrome106
ENV APP_HOME /app

# 日本語フォント表示用にnoto-cjkを追加
RUN apt-get update --allow-releaseinfo-change
RUN apt-get install --no-install-recommends -y fonts-noto fonts-noto-cjk

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY . .
ENV CI=1
RUN npm ci
RUN npx cypress verify
