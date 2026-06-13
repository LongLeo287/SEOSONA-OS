package runtime

import (
	"encoding/base64"
	"context"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/21st-dev/21st-sdk-go/agent"
	"github.com/google/jsonschema-go/jsonschema"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func registerTool(
	server *mcp.Server,
	name string,
	tool agent.ToolDefinition,
	env map[string]string,
) error {
	inputSchema, err := inputSchemaForTool(tool)
	if err != nil {
		return fmt.Errorf("tool %q input schema: %w", name, err)
	}

	manifest := tool.Manifest(name)

	server.AddTool(&mcp.Tool{
		Name:        name,
		Description: manifest.Description,
		InputSchema: inputSchema,
	}, func(ctx context.Context, req *mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		input, err := decodeToolInput(tool, req)
		if err != nil {
			return nil, fmt.Errorf("invalid tool input: %w", err)
		}

		result, err := tool.ExecuteValue(ctx, input, agent.ToolContext{Env: env})
		if err != nil {
			return &mcp.CallToolResult{
				Content: []mcp.Content{
					&mcp.TextContent{Text: err.Error()},
				},
				IsError: true,
			}, nil
		}

		return toMCPResult(result)
	})

	return nil
}

func inputSchemaForTool(tool agent.ToolDefinition) (any, error) {
	inputType := tool.InputType()
	if inputType == nil {
		return map[string]any{"type": "object"}, nil
	}
	if inputType.Kind() == reflect.Pointer {
		inputType = inputType.Elem()
	}
	if inputType.Kind() == reflect.Struct && inputType.NumField() == 0 {
		return map[string]any{"type": "object"}, nil
	}
	return jsonschema.ForType(inputType, nil)
}

func decodeToolInput(tool agent.ToolDefinition, req *mcp.CallToolRequest) (any, error) {
	inputType := tool.InputType()
	if inputType == nil {
		return nil, nil
	}

	target := reflect.New(inputType)
	if inputType.Kind() == reflect.Pointer {
		target = reflect.New(inputType.Elem())
	}

	if req.Params.Arguments != nil {
		if err := json.Unmarshal(req.Params.Arguments, target.Interface()); err != nil {
			return nil, err
		}
	}

	if inputType.Kind() == reflect.Pointer {
		return target.Interface(), nil
	}

	return target.Elem().Interface(), nil
}

func toMCPResult(result agent.CallToolResult) (*mcp.CallToolResult, error) {
	content := make([]mcp.Content, 0, len(result.Content))
	for _, item := range result.Content {
		switch item.Type {
		case "image":
			data, err := base64.StdEncoding.DecodeString(item.Data)
			if err != nil {
				return nil, fmt.Errorf("invalid image data: %w", err)
			}
			content = append(content, &mcp.ImageContent{
				Data:     data,
				MIMEType: item.MIMEType,
			})
		default:
			content = append(content, &mcp.TextContent{Text: item.Text})
		}
	}

	return &mcp.CallToolResult{
		Content: content,
		IsError: result.IsError,
	}, nil
}
