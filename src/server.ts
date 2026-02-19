import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import fs from "node:fs/promises"
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

// Tools
server.tool("create-user", "Create a new user in the database", {
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string()
}, {
    title: "Create User", //These annotations provide hints to AI what it can do and what it can't
    readOnlyHint: false, //Since we creating user it's not read only so that AI knows it adds , manipulates or updates the data
    destructiveHint: false, //Does this destroy anythings , we kept it false as this won't delete any data
    idempotentHint: false, //If we run this function multiple times with same input is it going to create multiple users? False
    openWorldHint: true  //Is this function going to interact with external tools like external database or something
}, async (params) => {
    try {
        const id = await createUser(params);
        return {
            content: [
                { type: "text", text: `User ${id} created successfully` }
            ]
        }
    } catch {
        return {
            content: [
                { type: "text", text: "Failed to save user" }
            ]
        }
    }
})

//Prompts
//   server.prompt()

async function createUser(user: {
    name: string,
    email: string,
    address: string,
    phone: string
}) {
    const users = await import("./data/users.json", {
        with: { type: "json" }
    }).then(m => m.default);
    const id = users.length + 1;
    users.push({ id, ...user })
    await fs.writeFile("./src/data/users.json",JSON.stringify(users,null,2));
    return id;
}

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport);
}

main()