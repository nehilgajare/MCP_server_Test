import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

//server metadata
const server = new McpServer({
    name: "test",
    version: "1.0.0"
});

/*
  Resources, tools, and prompts are empty for now.
  You will register them later like:
*/
//Resources
//   server.resource({
//     name:"res"
//   });

//Tools
//   server.tool({

//   })

//Prompts
//   server.prompt()

async function main(){
    const transport = new StdioServerTransport()
    await server.connect(transport);
}

main()