FROM gcr.io/medea-common-262502/gg AS gg
FROM ubuntu:20.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive apt-get -yq install wget \
    python3 \
    python3-pip \
    ssh

WORKDIR /opt
RUN wget https://julialang-s3.julialang.org/bin/linux/x64/1.6/julia-1.6.3-linux-x86_64.tar.gz
RUN tar xzf julia-1.6.3-linux-x86_64.tar.gz
RUN ln -s /opt/julia-1.6.3/bin/julia /usr/local/bin/julia

RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip

RUN pip install pyarrow pandas google-cloud-bigquery

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
