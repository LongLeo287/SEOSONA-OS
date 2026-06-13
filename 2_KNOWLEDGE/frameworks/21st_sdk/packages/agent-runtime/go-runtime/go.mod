module github.com/21st-dev/agent-runtime-go

go 1.23.0

require (
	github.com/21st-dev/21st-sdk-go v0.0.0
	github.com/google/jsonschema-go v0.3.0
	github.com/joho/godotenv v1.5.1
	github.com/modelcontextprotocol/go-sdk v1.0.0
)

require github.com/yosida95/uritemplate/v3 v3.0.2 // indirect

replace github.com/21st-dev/21st-sdk-go => ../../an-sdk/golang-sdk
