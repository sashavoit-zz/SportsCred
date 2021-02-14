FROM golang:1.15

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o api-go cmd/main.go

EXPOSE 3001
ENTRYPOINT ["/app/api-go"]
