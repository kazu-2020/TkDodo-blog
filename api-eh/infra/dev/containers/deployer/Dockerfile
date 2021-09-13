FROM ruby:3.0.2

ENV PATH /root/.local/bin:$PATH
ENV LANG C.UTF-8
ENV DOCKER_VERSION=18.09.6
RUN set -ex \
  && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
  && apt-get update \
  && apt-get install -y \
  nodejs \
  gzip \
  jq \
  iptables \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g yarn \
  && echo "####################################" \
  && echo docker install \
  && curl -L -o /tmp/docker-${DOCKER_VERSION}.tgz https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz \
  && tar -xz -C /tmp -f /tmp/docker-${DOCKER_VERSION}.tgz \
  && mv /tmp/docker/* /usr/bin \
  && echo "####################################" \
  && echo awscli install \
  && curl -sL https://bootstrap.pypa.io/get-pip.py | python3 - --user \
  && pip --version \
  && pip install awscli --upgrade \
  && echo "####################################" \
  && echo ecs cli install \
  && curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest \
  && chmod 755 /usr/local/bin/ecs-cli

VOLUME /var/lib/docker
