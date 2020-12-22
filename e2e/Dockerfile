FROM cypress/browsers:node12.14.1-chrome83-ff77

ENV APP_HOME /app

# 日本語フォント表示用にnoto-cjkを追加
RUN apt-get update
RUN apt-get install --no-install-recommends -y fonts-noto fonts-noto-cjk

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY . .
ENV CI=1
RUN npm ci
RUN npx cypress verify
