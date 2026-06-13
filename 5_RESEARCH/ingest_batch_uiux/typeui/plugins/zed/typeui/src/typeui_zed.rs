use schemars::JsonSchema;
use serde::Deserialize;
use zed::settings::ContextServerSettings;
use zed_extension_api::{
    self as zed, serde_json, Command, ContextServerConfiguration, ContextServerId, Os, Project,
    Result,
};

const MCP_REMOTE_PACKAGE: &str = "mcp-remote";
const MCP_REMOTE_VERSION: &str = "latest";
const TYPEUI_MCP_URL: &str = "https://mcp.typeui.sh/mcp";

struct TypeUIZedExtension;

#[derive(Debug, Default, Deserialize, JsonSchema)]
struct TypeUIContextServerSettings {
    /// Optional override for self-hosted or staging TypeUI MCP deployments.
    #[serde(default)]
    mcp_url: Option<String>,
}

impl zed::Extension for TypeUIZedExtension {
    fn new() -> Self {
        Self
    }

    fn context_server_command(
        &mut self,
        _context_server_id: &ContextServerId,
        project: &Project,
    ) -> Result<Command> {
        if zed::npm_package_installed_version(MCP_REMOTE_PACKAGE)?.is_none() {
            zed::npm_install_package(MCP_REMOTE_PACKAGE, MCP_REMOTE_VERSION)?;
        }

        let settings = ContextServerSettings::for_project("typeui", project)?;
        let settings = match settings.settings {
            Some(settings) => serde_json::from_value::<TypeUIContextServerSettings>(settings)
                .map_err(|error| error.to_string())?,
            None => TypeUIContextServerSettings::default(),
        };

        let mcp_url = settings.mcp_url.unwrap_or_else(|| TYPEUI_MCP_URL.to_string());
        let command = if zed::current_platform().0 == Os::Windows {
            "node_modules/.bin/mcp-remote.cmd".to_string()
        } else {
            let path = "node_modules/.bin/mcp-remote";
            zed::make_file_executable(path)?;
            path.to_string()
        };

        Ok(Command {
            command,
            args: vec![mcp_url],
            env: Vec::new(),
        })
    }

    fn context_server_configuration(
        &mut self,
        _context_server_id: &ContextServerId,
        _project: &Project,
    ) -> Result<Option<ContextServerConfiguration>> {
        let installation_instructions =
            include_str!("../configuration/installation_instructions.md").to_string();
        let default_settings = include_str!("../configuration/default_settings.jsonc").to_string();
        let settings_schema =
            serde_json::to_string(&schemars::schema_for!(TypeUIContextServerSettings))
                .map_err(|error| error.to_string())?;

        Ok(Some(ContextServerConfiguration {
            installation_instructions,
            default_settings,
            settings_schema,
        }))
    }
}

zed::register_extension!(TypeUIZedExtension);
