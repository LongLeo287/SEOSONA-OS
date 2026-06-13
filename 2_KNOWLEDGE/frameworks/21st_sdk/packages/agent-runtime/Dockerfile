FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV RUNTIME_DIR=/home/user/runtime
WORKDIR ${RUNTIME_DIR}

RUN apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  software-properties-common \
  && add-apt-repository -y ppa:ubuntu-toolchain-r/test \
  && apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  autoconf \
  bison \
  build-essential \
  bubblewrap \
  ca-certificates \
  cmake \
  curl \
  diffutils \
  docker.io \
  e2fsprogs \
  git \
  gnupg \
  htop \
  iproute2 \
  jq \
  libbz2-dev \
  libcurl4-openssl-dev \
  libdb-dev \
  libdbus-1-3 \
  libffi-dev \
  libgdbm-dev \
  liblzma-dev \
  libncurses5-dev \
  libonig-dev \
  libreadline-dev \
  libsqlite3-dev \
  libssl-dev \
  libsodium-dev \
  libxml2-dev \
  libxmlsec1-dev \
  libyaml-dev \
  libzip-dev \
  nano \
  openssh-client \
  patch \
  pkg-config \
  postgresql-client \
  redis-tools \
  ripgrep \
  screen \
  sqlite3 \
  socat \
  tar \
  tk-dev \
  tmux \
  tree \
  unzip \
  util-linux \
  uuid-dev \
  vim \
  wget \
  xz-utils \
  zip \
  zlib1g-dev \
  gcc-13 \
  g++-13 \
  && update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-13 100 \
  && update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-13 100 \
  && update-alternatives --install /usr/bin/cc cc /usr/bin/gcc-13 100 \
  && update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++-13 100 \
  && rm -rf /var/lib/apt/lists/*

RUN bash -lc 'curl -fsSL https://gvisor.dev/archive.key \
  | gpg --dearmor -o /usr/share/keyrings/gvisor.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/gvisor.gpg] https://storage.googleapis.com/gvisor/releases release main" \
  > /etc/apt/sources.list.d/gvisor.list \
  && apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq runsc \
  && runsc install \
  && rm -rf /var/lib/apt/lists/*'

RUN bash -lc 'ARCH=$(uname -m | sed "s/x86_64/amd64/;s/aarch64/arm64/") \
  && mkdir -p /home/user/.local/bin /tmp/moat-install \
  && curl -fsSL "https://github.com/majorcontext/moat/releases/download/v0.4.0/moat_0.4.0_linux_${ARCH}.tar.gz" \
  | tar -xz -C /tmp/moat-install \
  && mv /tmp/moat-install/moat /home/user/.local/bin/moat \
  && chmod +x /home/user/.local/bin/moat'

RUN mkdir -p /home/user/.local/bin \
  && curl -sSL https://github.com/cli/cli/releases/download/v2.67.0/gh_2.67.0_linux_amd64.tar.gz \
  | tar -xz -C /tmp \
  && mv /tmp/gh_2.67.0_linux_amd64/bin/gh /home/user/.local/bin/gh

ENV MISE_DATA_DIR=/opt/mise/data
ENV MISE_CONFIG_DIR=/opt/mise/config
ENV MISE_CACHE_DIR=/opt/mise/cache
ENV MISE_GLOBAL_CONFIG_FILE=/opt/mise/config/config.toml
ENV MISE_INSTALL_PATH=/usr/local/bin/mise
ENV MISE_YES=1
ENV MISE_NO_ANALYTICS=1
ENV MISE_TRUSTED_CONFIG_PATHS=/home/user/workspace
ENV PATH=${MISE_DATA_DIR}/shims:/home/user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN mkdir -p ${MISE_CONFIG_DIR} ${MISE_DATA_DIR} ${MISE_CACHE_DIR} \
  && curl -fsSL https://mise.run | sh \
  && chmod -R a+rX ${MISE_CONFIG_DIR} ${MISE_DATA_DIR} ${MISE_CACHE_DIR}

COPY mise.config.toml ${MISE_GLOBAL_CONFIG_FILE}
RUN mise install \
  && python -m ensurepip --upgrade \
  && mise reshim

COPY sandbox-package.json ${RUNTIME_DIR}/package.json
RUN npm install

RUN npm install -g @agentclientprotocol/claude-agent-acp@0.26.0 @zed-industries/codex-acp@0.9.3

COPY src ${RUNTIME_DIR}/src
COPY tsconfig.json ${RUNTIME_DIR}/tsconfig.json
COPY start-runtime.sh ${RUNTIME_DIR}/start-runtime.sh

RUN chmod +x ${RUNTIME_DIR}/start-runtime.sh \
  && mkdir -p /home/user/runtime /home/user/workspace /home/user/repo

ENV NODE_ENV=production
ENV PORT=3003
ENV MCP_PORT=3004

EXPOSE 3003 3004

CMD ["/bin/bash", "/home/user/runtime/start-runtime.sh"]
