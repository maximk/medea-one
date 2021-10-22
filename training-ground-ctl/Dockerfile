FROM gcr.io/medea-common-262502/gg AS gg
FROM golang:1.16.3-alpine3.13 AS build
RUN apk update && apk add --no-cache git openssh-client

# private repo access
ARG SSH_PRIVATE_KEY
RUN mkdir /root/.ssh
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com > /root/.ssh/known_hosts
RUN echo -e "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig
RUN go env -w GOPRIVATE=github.com/PurTech/*
# private repo access

RUN mkdir /build
WORKDIR /build
COPY ./go.mod .

RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -o training-ground-ctl
#--------------------------------------------------------------------------------
FROM alpine:3.13.4
RUN apk update && apk add --no-cache ca-certificates
RUN apk add tzdata

RUN mkdir /app
WORKDIR /app

COPY --from=gg /tools/gg .
COPY --from=build /build/training-ground-ctl .
COPY --from=build /build/app.* .

RUN echo "bob:x:1000:1000::/:nologin" >> /etc/passwd
USER bob

ENTRYPOINT ["./gg", "run", "./training-ground-ctl"]
