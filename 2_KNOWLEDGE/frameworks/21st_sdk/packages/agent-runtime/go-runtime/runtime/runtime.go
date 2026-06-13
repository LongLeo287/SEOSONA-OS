package runtime

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/21st-dev/21st-sdk-go/agent"
	"github.com/joho/godotenv"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type ServeOptions struct {
	Host string
	Port int
}

func WriteManifest(w io.Writer, config agent.Config) error {
	config = agent.New(config)
	return json.NewEncoder(w).Encode(config.Manifest())
}

func ServeMCP(config agent.Config, opts ServeOptions) error {
	config = agent.New(config)
	host := opts.Host
	if host == "" {
		host = "127.0.0.1"
	}
	port := opts.Port
	if port == 0 {
		port = 3210
	}

	return http.ListenAndServe(fmt.Sprintf("%s:%d", host, port), NewHandler(config))
}

func NewHandler(config agent.Config) http.Handler {
	config = agent.New(config)

	server := mcp.NewServer(&mcp.Implementation{
		Name:    "user-tools",
		Version: "1.0.0",
	}, nil)

	env := currentEnv()
	for name, tool := range config.Tools {
		if tool == nil {
			continue
		}
		if err := registerTool(server, name, tool, env); err != nil {
			panic(err)
		}
	}

	handler := mcp.NewStreamableHTTPHandler(func(_ *http.Request) *mcp.Server {
		return server
	}, &mcp.StreamableHTTPOptions{
		Stateless:    true,
		JSONResponse: true,
	})

	mux := http.NewServeMux()
	mux.Handle("/mcp", handler)
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	return mux
}

func currentEnv() map[string]string {
	env, err := godotenv.Read("/home/user/.env")
	if err != nil {
		return map[string]string{}
	}
	return env
}
