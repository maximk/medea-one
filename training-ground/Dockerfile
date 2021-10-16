FROM gcr.io/medea-common-262502/gg AS gg
FROM julia:1.6.3

RUN apt-get -y update && apt-get -y install ssh \
    python3 \
    python3-pip

RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip

RUN pip install pandas google-cloud-bigquery

RUN mkdir /app
WORKDIR /app

# Cloud Run silently changes HOME to /home for root user
RUN useradd -m bob
RUN chown -R bob:bob /app 
USER bob

# private repo access
ARG SSH_PRIVATE_KEY
RUN mkdir ~/.ssh
RUN echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa
RUN ssh-keyscan github.com > ~/.ssh/known_hosts
RUN echo "[url \"ssh://git@github.com/PurTech\"]\n\tinsteadOf = https://github.com/PurTech" >> ~/.gitconfig
# private repo access

COPY --from=gg /tools/gg .
COPY . .

RUN eval `ssh-agent` && ssh-add  && julia install.jl

ENTRYPOINT ["./gg", "run", "./training-ground.jl"]
