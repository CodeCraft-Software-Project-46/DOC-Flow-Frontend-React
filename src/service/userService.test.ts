import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {userService} from "../service/UserService";


const mock = new MockAdapter(axios);

describe("User Service Tests", () => {

    afterEach(() => {
        mock.reset();
    });

    // GET USERS
    test("should fetch users", async () => {

        const mockData = [
            { id: 1, name: "John" },
            { id: 2, name: "Mary" }
        ];

        mock.onGet("http://localhost:8000/api/user/user/getAll/")
            .reply(200, mockData);

        const result = await userService.getUsers();

        expect(result).toEqual(mockData);
    });

    // create user
    test("should create user", async () => {

        const newUser = { name: "Alex" };

        mock.onPost("http://localhost:8000/api/user/user/save/")
            .reply(201, { message: "User created" });

        const result = await userService.createUser(newUser);

        expect(result.message).toBe("User created");
    });

    // update user
    test("should update user", async () => {

        const updatedData = { name: "Updated Name" };

        mock.onPut("http://localhost:8000/api/user/user/update/1/")
            .reply(200, { message: "User updated" });

        const result = await userService.updateUser("1", updatedData);

        expect(result.message).toBe("User updated");
    });

    //delete user
    test("should delete user", async () => {

        mock.onDelete("http://localhost:8000/api/user/user/delete/1/")
            .reply(200, { message: "User deleted" });

        const result = await userService.deleteUser("1");

        const data = await result;

        expect(data.data.message).toBe("User deleted");
    });

});