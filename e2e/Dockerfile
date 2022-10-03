FROM cypress/base

ENV APP_HOME /app

# 日本語フォント表示用にnoto-cjkを追加
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN apt-get update --allow-releaseinfo-change
RUN apt-get install --no-install-recommends -y fonts-noto fonts-noto-cjk

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY . .
ENV CI=1
RUN npm install
RUN $(npm bin)/cypress run
