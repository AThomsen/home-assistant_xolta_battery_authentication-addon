ARG BUILD_ARCH
FROM ghcr.io/hassio-addons/debian-base/${BUILD_ARCH}:6.2.3

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install requirements for add-on: chromium webdriver, python3, selenium, flask
RUN \
    apt-get update \
    && apt-get install -y --no-install-recommends \
    chromium-driver \
    python3-dev=3.9.2-3 \
    python3=3.9.2-3 \
    \
    && curl https://bootstrap.pypa.io/get-pip.py | python3 \
    \
    && update-alternatives \
    --install /usr/bin/python python /usr/bin/python3 10 \
    \
    && pip3 install --no-cache-dir selenium-wire flask \
    \
    && apt-get purge -y --auto-remove \
    bsdtar \
    build-essential \
    python3-dev \
    uuid-runtime \
    \
    && find /usr/local \
    \( -type d -a -name test -o -name tests -o -name '__pycache__' \) \
    -o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
    -exec rm -rf '{}' + \
    \
    && rm -fr \
    /tmp/* \
    /root/{.cache,.config,.gnupg,.local,.log,.npm} \
    /usr/local/share/.cache \
    /var/{cache,log}/* \
    /var/lib/apt/lists/*

WORKDIR /app

# Copy data for add-on
COPY app /app
RUN chmod a+x /app/run.sh

CMD [ "/app/run.sh" ]
