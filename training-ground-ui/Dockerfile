FROM ubuntu:21.04 as build
RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive apt-get -y install ssh git-core \
    nodejs \
    npm \
    golang

# private repo access
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com > /root/.ssh/known_hosts
RUN echo "[url \"ssh://git@github.com/PurTech\"]\n\tinsteadOf = https://github.com/PurTech" >> ~/.gitconfig
RUN go env -w GOPRIVATE=github.com/PurTech/*
# private repo access

RUN mkdir /_
WORKDIR /_

COPY ./go.mod .
RUN go mod download

COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -o training-ground-ui

COPY package.json .
COPY package-lock.json .
RUN npm install --silent
RUN npm install react-scripts --silent

COPY src ./src/
COPY src/components ./src/components/
COPY public ./public/
RUN npm run build

#--------------------------------------------------------------------------------
FROM alpine:3.13.4
RUN apk update && apk add --no-cache ca-certificates
RUN apk add tzdata

RUN mkdir /app
WORKDIR /app

COPY --from=build /_/build ./build/
COPY --from=build /_/training-ground-ui .

RUN echo "bob:x:1000:1000::/:nologin" >> /etc/passwd
USER bob

ENTRYPOINT ["./training-ground-ui"]
