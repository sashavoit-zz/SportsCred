FROM golang:1.15 as builder

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o api-go cmd/main.go

###

FROM alpine:3.9

COPY --from=builder /app/api-go /app/
RUN apk add --no-cache ca-certificates

EXPOSE 3001
ENTRYPOINT ["app/api-go"]
