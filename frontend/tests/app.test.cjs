    // import { jest } from "@jest/globals";
    // import { loadPlayers } from "../app";
    const fs = require("fs")
    document.body.innerHTML = fs.readFileSync("../index.html", "utf8");
    
    const loadPlayers = require("../app.js");


    describe("Test frontend", () => {

    fetch = jest.fn();

    beforeEach(() => {
        fetch = jest.fn();
    });

    describe("Test loadPlayers()", () => {
        
        it("prints the players on the DOM", async () => {


            global.fetch = jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue([
                { Id: 1, name: "John", age: 34 },
                { Id: 2, name: "John", age: 34 },
                { Id: 3, name: "John", age: 34 },
                { Id: 4, name: "John", age: 34 },
               ]),
               ok: true,

            });

            await loadPlayers();           

            expect(document.getElementById("players-list").children.length).toBe(4);  

        })
    })

})